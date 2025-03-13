import PropTypes from "prop-types";
// react-icons
import { MdArrowDropDown } from "react-icons/md";

// components
import UserImageUpload from "./user-image";
import LoadingSpinner from "../loading/loading-spinner";

// shadcn ui
import { Button } from "../ui/button";

export default function ScannedForms({
  trackingNo,
  isScannedDataFieldEmpty,
  loadNo,
  currentDate,
  receivedBy,
  setReceivedBy,
  receivedByError,
  setReceivedByError,
  selectedProductCode,
  setSelectedProductCode,
  selectedProductCodeError,
  setSelectedProductCodeError,
  availableProductCodes,
  receivedQuantity,
  setReceivedQuantity,
  receivedQuantityError,
  setReceivedQuantityError,
  uom,
  remarks,
  setRemarks,
  remarksError,
  setRemarksError,
  uploadedImages,
  setUploadedImages,
  handleSubmit,
  isLoading,
  isButtonDisabled,
}) {
  return (
    <form>
      <div className="xl:flex xl:gap-x-3 xl:mb-5">
        <div className="xl:w-1/2 mb-5">
          <label>Tracking No.</label>
          <input
            value={trackingNo || ""}
            type="text"
            placeholder="Tracking No."
            className="p-3 w-full mt-1 rounded-lg bg-gray-200 cursor-not-allowed text-gray-500 placeholder-gray-500  xl:mb-0"
            disabled
          />
          {isScannedDataFieldEmpty && (
            <p className="text-red-500 text-sm w-full mt-2 ">
              {isScannedDataFieldEmpty}
            </p>
          )}
        </div>

        <div className="xl:w-1/2 mb-5">
          <label>Load No.</label>
          <input
            value={loadNo || ""}
            type="text"
            placeholder="Load No."
            className="p-3 w-full mt-1 rounded-lg bg-gray-200 cursor-not-allowed text-gray-500 placeholder-gray-500  xl:mb-0"
            disabled
          />
          {isScannedDataFieldEmpty && (
            <p className="text-red-500 text-sm w-full mt-2 ">
              {isScannedDataFieldEmpty}
            </p>
          )}
        </div>
      </div>
      <div className="xl:flex xl:gap-x-3 xl:mb-5">
        <div className="xl:w-1/2">
          <label>Received Date</label>
          <input
            value={currentDate}
            type="datetime-local"
            className="p-3 w-full mt-1 rounded-lg bg-gray-200 cursor-not-allowed text-gray-500 mb-5 xl:mb-0"
            disabled
          />
        </div>

        <div className="xl:w-1/2 mb-5">
          <label>Received By</label>
          <input
            value={receivedBy}
            onChange={(e) => {
              setReceivedBy(e.target.value);
              if (receivedByError) setReceivedByError("");
            }}
            type="text"
            placeholder="Enter the name of the recipient."
            className="p-3 w-full mt-1 rounded-lg bg-yellow-50 focus:bg-white  xl:mb-0"
          />
          {receivedByError && (
            <p className="text-red-500 text-sm w-full mt-2 ">
              {receivedByError}
            </p>
          )}
        </div>
      </div>
      <div className="mb-5">
        <label>Product Code - Description</label>
        <div className="relative ">
          <select
            className="p-3 w-full mt-1 rounded-lg bg-gray-200 text-gray-500 outline-0 appearance-none pr-10"
            value={selectedProductCode}
            onChange={(e) => {
              setSelectedProductCode(e.target.value);
              if (selectedProductCodeError) setSelectedProductCodeError("");
            }}
          >
            <option value="">Select Product Code</option>
            {availableProductCodes.map((item) => (
              <option key={item.productCode} value={item.productCode}>
                {item.productCode}
              </option>
            ))}
          </select>
          {/* custom Arrow */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <MdArrowDropDown size={20} />
          </div>
        </div>
        {isScannedDataFieldEmpty && (
          <p className="text-red-500 text-sm w-full mt-2 ">
            {isScannedDataFieldEmpty}
          </p>
        )}

        {selectedProductCodeError && (
          <p className="text-red-500 text-sm w-full mt-2 ">
            {selectedProductCodeError}
          </p>
        )}
      </div>
      <div className="xl:flex xl:gap-x-3 xl:mb-5">
        <div className="xl:w-1/2 mb-5">
          <label>Received Quantity</label>
          <input
            value={receivedQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setReceivedQuantity(value);
                if (receivedQuantityError) setReceivedQuantityError("");
              }
            }}
            type="text"
            placeholder="Enter the received quantity."
            className="p-3 w-full mt-1 rounded-lg bg-yellow-50 focus:bg-white xl:mb-0"
          />
          {receivedQuantityError && (
            <p className="text-red-500 text-sm w-full mt-2 ">
              {receivedQuantityError}
            </p>
          )}
        </div>

        <div className="xl:w-1/2 mb-5 ">
          <label className="">UOM</label>
          <input
            value={uom || ""}
            type="text"
            placeholder="UOM"
            className="p-3 w-full mt-1 rounded-lg bg-gray-200 cursor-not-allowed text-gray-500 placeholder-gray-500 xl:mb-0"
            disabled
          />

          {isScannedDataFieldEmpty && (
            <p className="text-red-500 text-sm w-full mt-2 ">
              {isScannedDataFieldEmpty}
            </p>
          )}
        </div>
      </div>
      <div className="mb-5">
        <label>
          Remarks{" "}
          <span className="text-sm text-[#979090]">
            ( put &apos;N/A&apos; if none ).
          </span>
        </label>

        <textarea
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            if (remarksError) setRemarksError("");
          }}
          placeholder="Enter the remarks"
          className="border p-2 mt-1 border-gray-400 w-full font-inter rounded-lg h-32 resize-none overflow-hidden "
        />

        {remarksError && (
          <p className="text-red-500 text-sm w-full mt-1 ">{remarksError}</p>
        )}
      </div>

      <UserImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
      <Button
        onClick={handleSubmit}
        className={
          isLoading
            ? "w-full mt-5 py-6 bg-black rounded-md cursor-not-allowed opacity-70"
            : availableProductCodes.length === 0
            ? "w-full mt-5 py-6 bg-[#008000] rounded-md cursor-not-allowed"
            : "w-full mt-5 py-6 bg-black rounded-md cursor-pointer"
        }
        disabled={isButtonDisabled}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-x-2">
            <span>Loading</span>
            <LoadingSpinner />
          </div>
        ) : availableProductCodes.length === 0 ? (
          "Scan Tracking No. "
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}

ScannedForms.propTypes = {
  trackingNo: PropTypes.string.isRequired,
  isScannedDataFieldEmpty: PropTypes.bool.isRequired,
  loadNo: PropTypes.string.isRequired,
  currentDate: PropTypes.string.isRequired,
  receivedBy: PropTypes.string.isRequired,
  setReceivedBy: PropTypes.string.isRequired,
  receivedByError: PropTypes.string,
  setReceivedByError: PropTypes.func.isRequired,
  selectedProductCode: PropTypes.string.isRequired,
  setSelectedProductCode: PropTypes.func.isRequired,
  selectedProductCodeError: PropTypes.string,
  setSelectedProductCodeError: PropTypes.func.isRequired,
  availableProductCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  receivedQuantity: PropTypes.number.isRequired,
  setReceivedQuantity: PropTypes.func.isRequired,
  receivedQuantityError: PropTypes.string,
  setReceivedQuantityError: PropTypes.func.isRequired,
  uom: PropTypes.string.isRequired,
  remarks: PropTypes.string,
  setRemarks: PropTypes.func.isRequired,
  remarksError: PropTypes.string,
  setRemarksError: PropTypes.func.isRequired,
  uploadedImages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUploadedImages: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired,
};
