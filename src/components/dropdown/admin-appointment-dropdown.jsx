// ---- react
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// ---- headlessui - tailwind
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// ---- reports
import AppointmentGeneralToday from "@/report/appointment-general-today";
import AppointmentGeneralAll from "@/report/appointment-general-all";

// ---- library
import { pdf } from "@react-pdf/renderer"; // ---- generate pdf
import { Filter } from "lucide-react"; // ---- icon
import { Buffer } from "buffer"; // ---- buffer to prevent warning

// Prevent warning caused by react-pdf
window.Buffer = Buffer;

export default function AppointmentDropdown({
  todayData,
  allData,
  startDate,
  endDate,
  type,
}) {
  // ---- state for today appointment report (today-appointment)
  const [todayReportUrl, setTodayReportUrl] = useState(null);

  // ---- state for all appointment report (all-appointment)
  const [allReportUrl, setAllReportUrl] = useState(null);

  // ---- get the today ph date for filename
  const todayDate = new Date().toLocaleString("en-PH", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Manila",
  });

  // ---- generate today's report pdf (today-appointment)
  useEffect(() => {
    const generateTodayPdf = async () => {
      if (!todayData || todayData.length === 0) return;

      const pdfBlob = await pdf(
        <AppointmentGeneralToday data={todayData} />
      ).toBlob();
      setTodayReportUrl(URL.createObjectURL(pdfBlob));
    };

    generateTodayPdf();
  }, [todayData]);

  // ---- generate all report (all-appointment)
  useEffect(() => {
    const generateAllPdf = async () => {
      if (!allData || allData.length === 0) return;

      const pdfBlob = await pdf(
        <AppointmentGeneralAll data={allData} />
      ).toBlob();
      setAllReportUrl(URL.createObjectURL(pdfBlob));
    };

    generateAllPdf();
  }, [allData]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
          <Filter size={18} />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 border-1">
        <div className="py-1 flex flex-col">
          {type === "all" ? (
            <>
              {/* Download All Report */}
              <MenuItem as="div">
                {allReportUrl ? (
                  <a
                    href={allReportUrl}
                    download={`ALL_APPOINTMENT_REPORT`}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    Download All Report
                  </a>
                ) : (
                  <span className="px-3 py-2 text-sm text-gray-500">
                    Generating PDF...
                  </span>
                )}
              </MenuItem>

              {/* Download by Date Range (placeholder) */}
              <MenuItem as="div">Download by Date Range</MenuItem>
            </>
          ) : (
            // Download Today's Report
            <MenuItem as="div">
              {todayReportUrl ? (
                <a
                  href={todayReportUrl}
                  download={`APPOINTMENT_REPORT_${todayDate.replace(
                    " ",
                    "_"
                  )}.pdf`}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                >
                  Download today’s report
                </a>
              ) : (
                <span className="px-3 py-2 text-sm text-gray-500">
                  Generating PDF...
                </span>
              )}
            </MenuItem>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}

AppointmentDropdown.propTypes = {
  todayData: PropTypes.array.isRequired,
  allData: PropTypes.array.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  type: PropTypes.string.isRequired,
};
