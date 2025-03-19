// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // prop validation

// ---- components ----
import { ADMIN_TRUCK_LIST_TABLE_HEADERS } from "../header/table-headers";
import OrderSummaryPagination from "./admin-order-summary-pagination";
import SearchBar from "../search/search-bar";

// ---- library ----
import { Link } from "react-router"; // ---- react router
import { useDebounce } from "react-use"; // ---- npm install react-use. this is a hook that helps us to debounce the search input.

export default function PriorityListTable({ data }) {
  // ---- state for handling the search input data (search engine)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // ---- state for pagination (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // ---- useDebounce hook helps us to prevent making too many requests to the api (search engine)
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ---- filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.truckModel
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      item.truckPlateNo
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      item.weightCapacity.toString().includes(debouncedSearchTerm) // Convert weightCapacity to string for matching
  );

  // ---- show 10 items per page (pagination)
  const itemsPerPage = 10;

  // ---- calculate total page (pagination)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // ---- get the current items for the page (pagination)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="table_section mt-5 font-inter w-full  ">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-5 px-4 flex justify-between items-center">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>

              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="th-user-table">
                    <tr>
                      {ADMIN_TRUCK_LIST_TABLE_HEADERS.map((headers, index) => (
                        <th key={index} className="px-6 py-3">
                          {headers}
                        </th>
                      ))}
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
                        <td className="td-admin-table ">
                          {item.weightCapacity} kg
                        </td>
                        <td className="td-admin-table ">
                          <Link to={`/admin/priority/${item.truckPlateNo}`}>
                            <span className="bg-[#343A40] px-4 text-white py-1 rounded-full w-fit">
                              {item.truckPlateNo}
                            </span>
                          </Link>
                        </td>
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

              {/* No data message BELOW pagination */}
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

PriorityListTable.propTypes = {
  data: PropTypes.array,
};
