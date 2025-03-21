// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // prop validation

// ---- components ----
import OrderSummaryPagination from "../admin-order-summary-pagination";
import { ADMIN_TRUCK_LIST_TABLE_HEADERS } from "@/components/header/table-headers";
// import TruckListModal from "@/components/modal/truck-list-modal";

// import { Plus } from "lucide-react"; // icons

// display on AdminOrderSummary page
export default function TruckListTable({ data }) {
  // check if the add truck modal is open
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // state for pagination (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // show 10 items per page (pagination)
  const itemsPerPage = 10;

  // calculate total page (pagination)
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // get the current items for the page (pagination)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table_section mt-5 font-inter w-full  ">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-5 px-4 flex justify-between items-center">
                {/* <div className="relative max-w-xs">
                  <input
                    type="text"
                    className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Search for details"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <svg
                      className="size-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                </div> */}
                {/* <div>
                  <button
                    title="Add Truck"
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={20} />
                  </button>
                </div> */}
              </div>
              {/* Truck List Modal */}
              {/* <TruckListModal open={isModalOpen} setOpen={setIsModalOpen} /> */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="th-user-table">
                    <tr>
                      {ADMIN_TRUCK_LIST_TABLE_HEADERS.map((headers, index) => (
                        <th key={index} className="px-6 py-3">
                          {headers}
                        </th>
                      ))}

                      {/* <th className="px-6 py-3 ">Action</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                      >
                        <td className="td-admin-table ">{index + 1}</td>
                        <td className="td-admin-table ">{item.truckModel}</td>
                        {/*<td className="td-admin-table ">{item.weightCapacity} kg</td>*/}
                        <td className="td-admin-table ">{item.truckPlateNo}</td>

                        {/* <td className="td-user-table flex gap-x-4 justify-center   ">
                          <button className="text-green-600 cursor-pointer">
                            <h1>Edit</h1>
                          </button>
                          <button className="text-red-600 cursor-pointer">
                            <h1>Delete</h1>
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <OrderSummaryPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />

              {currentItems.length === 0 && (
                <p className="text-gray-500 font-medium ml-5 py-5">
                  No truck list available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// props validation
TruckListTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      truckModel: PropTypes.string.isRequired,
      weightCapacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      truckPlateNo: PropTypes.string.isRequired,
    })
  ).isRequired,
};
