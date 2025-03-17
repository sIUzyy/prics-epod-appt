// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // ---- props-validation

// ---- component ----
import { ADMIN_USER_LIST_TABLE_HEADERS } from "@/components/header/table-headers"; // ---- table headers
import OrderSummaryPagination from "../admin-order-summary-pagination"; // ---- pagination
import DeleteUserAccount from "@/components/modal/delete-account"; // ---- modal
import UserListModal from "@/components/modal/user-list-modal"; // ---- modal
import SearchBar from "@/components/search/search-bar"; // ---- search bar

// ---- library ----
import { UserPlus } from "lucide-react"; // ---- icons

// display on AdminOrderSummary page
export default function UserListTable({ data }) {
  // ---- modal state check if its open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- state for selected id and username (delete)
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUserName] = useState(null);

  // ---- state for pagination (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // ---- show 10 items per page (pagination)
  const itemsPerPage = 10;

  // ---- calculate total page (pagination)
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // ---- get the current items for the page (pagination)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  // ---- function to handle delete modal
  const handleDeleteModal = (id, username) => {
    setSelectedUserId(id);
    setSelectedUserName(username);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      {/* create user modal  */}
      {isModalOpen && (
        <UserListModal open={isModalOpen} setOpen={setIsModalOpen} />
      )}

      {/* delete user modal */}
      {isDeleteModalOpen && (
        <DeleteUserAccount
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          selectedUserId={selectedUserId}
          selectedUsername={selectedUsername}
        />
      )}

      <div className="table_section mt-5 font-inter w-full  ">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-5 px-4 flex justify-between items-center">
                  <SearchBar />
                  <div>
                    <button
                      title="Add user account"
                      className="cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="th-user-table">
                      <tr>
                        {ADMIN_USER_LIST_TABLE_HEADERS.map((headers, index) => (
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

                          <td className="td-admin-table ">{item.name}</td>
                          <td className="td-admin-table ">{item.username}</td>
                          <td className="td-admin-table capitalize ">
                            {item.role}
                          </td>

                          <td className="td-user-table flex   ">
                            <button
                              onClick={() =>
                                handleDeleteModal(item._id, item.username)
                              }
                              className="text-red-600 cursor-pointer outline-none"
                            >
                              Delete
                            </button>
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
                    No user account list available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// props-validation
UserListTable.propTypes = {
  data: PropTypes.array,
};
