import PropTypes from "prop-types"; // prop validation

import { ArrowDownToLine } from "lucide-react"; // icons

import { PDFDownloadLink } from "@react-pdf/renderer"; // react-pdf

import { ADMIN_PER_TRACKING_NO_TABLE_HEADERS } from "../header/table-headers"; // component - headers

import AttachedFile from "@/report/e-pod-attached-file"; // components

// display on AdminOrderSummary page and data from WMS. predeliveryData from E-POD
export default function AdminOrderItemsTable({ data, preDeliveryData }) {
  return (
    <div className="table_section font-inter w-full mt-5  ">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-5 px-4"></div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="th-user-table">
                    <tr>
                      {ADMIN_PER_TRACKING_NO_TABLE_HEADERS.map(
                        (header, index) => (
                          <th key={index} className="px-6 py-3">
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => {
                      // find matching pre-delivery data tracking no === product code tracking no
                      const preDeliveryItem = preDeliveryData.find(
                        (pre) => pre.pre_delivery_trackingNo === item.trackingNo
                      );

                      return (
                        <tr
                          key={item._id}
                          className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                        >
                          <td className="td-admin-table  ">{index + 1}</td>
                          <td className="td-admin-table ">
                            {item.productCode}
                          </td>
                          <td className="td-admin-table ">
                            {item.description}
                          </td>
                          <td className="td-admin-table ">{item.shippedQty}</td>
                          <td className="td-admin-table ">
                            {item.total_cbm_per_item} kg
                          </td>

                          <td className="td-admin-table ">
                            {preDeliveryItem
                              ? preDeliveryItem.pre_delivery_products
                                  .filter(
                                    (product) =>
                                      product.productCode === item.productCode // Check if product codes match
                                  )
                                  .map((product) =>
                                    product.receivedQty
                                      ? product.receivedQty
                                      : "-"
                                  )
                              : "-"}
                          </td>
                          <td className="td-admin-table ">
                            {preDeliveryItem
                              ? preDeliveryItem.pre_delivery_products
                                  .filter(
                                    (product) =>
                                      product.productCode === item.productCode // Check if product codes match
                                  )
                                  .map(
                                    (product) =>
                                      product.remarks &&
                                      product.remarks.trim() !== ""
                                        ? product.remarks.toLowerCase() // Show actual remarks if available
                                        : "-" // Show "-" if remarks are empty
                                  )
                              : "-"}
                          </td>
                          <td
                            className="td-admin-table flex justify-center"
                            title="Download Product Code"
                          >
                            <PDFDownloadLink
                              document={
                                <AttachedFile
                                  preDeliveryData={preDeliveryData
                                    .map((pre) => ({
                                      ...pre,
                                      pre_delivery_products: (
                                        pre.pre_delivery_products || []
                                      ).filter(
                                        (product) =>
                                          product.productCode ===
                                          item.productCode
                                      ),
                                    }))
                                    .filter(
                                      (pre) =>
                                        pre.pre_delivery_products.length > 0
                                    )}
                                  selectedProductCode={item.productCode} // pass only selected product code
                                />
                              }
                              fileName={`${item.productCode}_ATTACHED_FILE.pdf`}
                            >
                              <ArrowDownToLine
                                size={20}
                                className="text-indigo-500"
                              />
                            </PDFDownloadLink>
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

// props validation
AdminOrderItemsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trackingNo: PropTypes.string.isRequired,
      productCode: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      shippedQty: PropTypes.number.isRequired,
      total_cbm_per_item: PropTypes.number.isRequired,
      delivery_status: PropTypes.string,
    })
  ).isRequired,
  preDeliveryData: PropTypes.arrayOf(
    PropTypes.shape({
      pre_delivery_trackingNo: PropTypes.string.isRequired,
      pre_delivery_products: PropTypes.arrayOf(
        PropTypes.shape({
          productCode: PropTypes.string.isRequired,
          receivedQty: PropTypes.number.isRequired,
          remarks: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
