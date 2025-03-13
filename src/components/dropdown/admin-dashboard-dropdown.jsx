import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Filter } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import GeneralEPODReport from "@/report/e-pod-report-general";
import PropTypes from "prop-types";
import { Buffer } from "buffer";

// prevent warning side of buffer is not define cause by react-pdf
window.Buffer = Buffer;

export default function Dropdown({
  data,
  preDeliveryData,
  startDate,
  endDate,
}) {
  // ---- state for all report
  const [allReportUrl, setAllReportUrl] = useState(null);

  // ---- state for filtered data by data-range report
  const [filteredReportUrl, setFilteredReportUrl] = useState(null);

  // Filter data based on date range
  const filteredData = data.filter((item) => {
    const shippedDate = new Date(item.shippedDate);
    if (startDate && shippedDate < startDate) return false;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (shippedDate > endOfDay) return false;
    }
    return true;
  });

  // Get the earliest and latest date from filteredData
  const filteredStartDate =
    filteredData.length > 0
      ? new Date(
          Math.min(...filteredData.map((item) => new Date(item.shippedDate)))
        )
      : null;
  const filteredEndDate =
    filteredData.length > 0
      ? new Date(
          Math.max(...filteredData.map((item) => new Date(item.shippedDate)))
        )
      : null;

  // format dates to "Month Year" format (e.g., "March 2024")
  const formatDate = (date) => {
    if (date) {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return "";
  };

  // Generate PDF URLs when component mounts or data changes
  useEffect(() => {
    const generatePdf = async () => {
      // Generate full report
      const allPdfBlob = await pdf(
        <GeneralEPODReport data={data} preDeliveryData={preDeliveryData} />
      ).toBlob();
      setAllReportUrl(URL.createObjectURL(allPdfBlob));

      // Generate filtered report
      const filteredPdfBlob = await pdf(
        <GeneralEPODReport
          data={filteredData}
          preDeliveryData={preDeliveryData}
        />
      ).toBlob();
      setFilteredReportUrl(URL.createObjectURL(filteredPdfBlob));
    };

    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, preDeliveryData, startDate, endDate]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
          <Filter size={18} />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 border-1 ">
        <div className="py-1 flex flex-col">
          {/* Download All Reports */}
          <MenuItem as="div">
            {allReportUrl ? (
              <a
                href={allReportUrl}
                download="GENERAL_EPOD_REPORT.pdf"
                className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
              >
                Download All E-POD Report
              </a>
            ) : (
              <span className="px-3 py-2 text-sm text-gray-500">
                Generating PDF...
              </span>
            )}
          </MenuItem>

          {/* Download Filtered Reports */}
          <MenuItem as="div">
            {filteredReportUrl ? (
              <a
                href={filteredReportUrl}
                download={`${formatDate(filteredStartDate)}${
                  filteredEndDate ? `_${formatDate(filteredEndDate)}` : ""
                }_EPOD_REPORT.pdf`}
                className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
              >
                Download Report (Date Range)
              </a>
            ) : (
              <span className="px-3 py-2 text-sm text-gray-500">
                Generating PDF...
              </span>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

Dropdown.propTypes = {
  data: PropTypes.array.isRequired,
  preDeliveryData: PropTypes.array.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};
