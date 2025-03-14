import { useState, useEffect, useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Filter } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import GeneralEPODReport from "@/report/e-pod-report-general";
import PropTypes from "prop-types";

// ---- prevent warning side of buffer is not define cause by react-pdf
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

export default function Dropdown({
  data,
  preDeliveryData,
  startDate,
  endDate,
}) {
  // Memoize filtered data to avoid recalculating on every render
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const shippedDate = new Date(item.shippedDate);
      if (startDate && shippedDate < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (shippedDate > endOfDay) return false;
      }
      return true;
    });
  }, [data, startDate, endDate]);

  // Memoize start and end dates from filtered data
  const [filteredStartDate, filteredEndDate] = useMemo(() => {
    if (filteredData.length === 0) return [null, null];
    const dates = filteredData.map((item) => new Date(item.shippedDate));
    return [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
  }, [filteredData]);

  // State for PDF URLs
  const [allReportUrl, setAllReportUrl] = useState(null);
  const [filteredReportUrl, setFilteredReportUrl] = useState(null);

  // Generate PDF URLs when data changes
  useEffect(() => {
    const generatePdf = async () => {
      try {
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
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    generatePdf();
  }, [data, preDeliveryData, filteredData]);

  // Format date to "Month Day, Year" (e.g., "March 1, 2024")
  const formatDate = (date) => {
    return (
      date?.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) || ""
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          title="filter"
          aria-label="Open filter menu"
          className="outline-none cursor-pointer inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <Filter size={18} />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 border-1">
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
