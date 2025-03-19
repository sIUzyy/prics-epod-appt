import { useState, useEffect } from "react"; // react

import PropTypes from "prop-types"; // props-validation

import { useWarehouse } from "@/context/WarehouseContextProvider"; // warehouse-context

import { fetchCoordinates } from "@/utils/fetchCoordinates"; // utils convert addresses to lat and long

import { USER_DASHBOARD_TABLE_HEADERS } from "../header/table-headers"; // component - headers

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const PH_TZ = "Asia/Manila";

export default function UserTable({ data, preDeliveryData }) {
  const { selectedWarehouse } = useWarehouse(); // context to get the selectedWarehouse in driver-input form

  const [warehouseCoords, setWarehouseCoords] = useState(null); // state for selectedWarehouse coordinate

  const [addressCoords, setAddressCoords] = useState({}); // state for data addresses coordinate

  const [sortedData, setSortedData] = useState([]); // state for sorting the data in order based on distance

  // fetch warehouse coordinates
  useEffect(() => {
    if (selectedWarehouse) {
      fetchCoordinates(selectedWarehouse).then(setWarehouseCoords);
    }
  }, [selectedWarehouse]);

  // fetch data addresses coordinates
  useEffect(() => {
    const fetchAllAddresses = async () => {
      const coordsMap = {};
      for (const item of data) {
        if (!coordsMap[item.address]) {
          coordsMap[item.address] = await fetchCoordinates(item.address);
        }
      }
      setAddressCoords(coordsMap);
    };

    if (data.length > 0) {
      fetchAllAddresses();
    }
  }, [data]);

  // haversine formula to calculate distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // sort data based on distance, also just show the today's delivery
  useEffect(() => {
    if (!warehouseCoords || Object.keys(addressCoords).length === 0) return;

    // Get today's date in PH time
    const todayPH = dayjs().tz(PH_TZ).startOf("day");

    const filteredData = data.filter((item) => {
      if (!item.shippedDate) return false; // Ensure there's a deliveryDate
      const deliveryDatePH = dayjs(item.shippedDate).tz(PH_TZ).startOf("day");
      return deliveryDatePH.isSame(todayPH);
    });

    const sorted = filteredData.map((item) => {
      const dropOffCoords = addressCoords[item.address];

      if (!dropOffCoords) {
        return { ...item, distance: "Distance not available", rank: "N/A" };
      }

      const distance = haversineDistance(
        warehouseCoords.lat,
        warehouseCoords.lng,
        dropOffCoords.lat,
        dropOffCoords.lng
      );

      return {
        ...item,
        distance: isNaN(distance)
          ? "Distance not available"
          : distance.toFixed(2),
        rank: null,
      };
    });

    const rankedData = sorted
      .filter((item) => item.distance !== "Distance not available")
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    const finalData = [
      ...rankedData,
      ...sorted.filter((item) => item.distance === "Distance not available"),
    ];

    setSortedData(finalData);
  }, [warehouseCoords, addressCoords, data]);

  // if no delivery for today, show this.
  if (sortedData.length === 0) {
    return (
      <p className="text-gray-500 font-medium px-0 py-5">
        No delivery for today.
      </p>
    );
  }

  return (
    <div className="table_section mt-5 font-inter w-full">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-5 px-4"></div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="th-user-table">
                    <tr>
                      {USER_DASHBOARD_TABLE_HEADERS.map((header, index) => (
                        <th key={index} className="px-6 py-3">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedData.map((item, index) => {
                      const preDeliveryItem = preDeliveryData.find(
                        (pre) => pre.pre_delivery_trackingNo === item.trackingNo
                      );

                      return (
                        <tr
                          key={item._id}
                          className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                        >
                          <td className="td-user-table">
                            {item.trackingNo}
                            <span className="ml-1 font-bold text-indigo-500">
                              [{item.productCodes.length}]
                            </span>
                          </td>
                          <td className="td-user-table">{item.customerName}</td>
                          <td className="td-user-table">
                            {preDeliveryItem
                              ? preDeliveryItem.pre_delivery_receivedBy
                              : "-"}
                          </td>
                          <td className="max-w-[320px] break-words whitespace-normal px-6 py-4 text-sm font-medium text-gray-800">
                            {item.address}
                          </td>
                          <td className="status">
                            {(() => {
                              let status = "pending";
                              if (preDeliveryItem) {
                                const preDeliveryProductCode =
                                  preDeliveryItem.pre_delivery_products.length;
                                const productCodesLength =
                                  item.productCodes.length;
                                if (
                                  preDeliveryProductCode === productCodesLength
                                ) {
                                  status = "success";
                                }
                              }
                              return (
                                <span
                                  className={
                                    status === "pending"
                                      ? "bg-[#FFA500] text-white px-5 py-1 rounded-full capitalize"
                                      : status === "success"
                                      ? "bg-[#28A745] text-white px-5 py-1 rounded-full capitalize"
                                      : "bg-gray-400 text-white px-5 py-1 rounded-full capitalize"
                                  }
                                >
                                  {status}
                                </span>
                              );
                            })()}
                          </td>
                          {/* <td className="td-user-table">
                            {typeof item.distance === "number"
                              ? item.distance.toFixed(2)
                              : item.distance}{" "}
                            km
                          </td> */}
                          <td className="td-user-table">{item.rank}</td>
                          <td className="td-user-table">
                            {item.priority || " - "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserTable.propTypes = {
  data: PropTypes.array.isRequired,
  preDeliveryData: PropTypes.array.isRequired,
};
