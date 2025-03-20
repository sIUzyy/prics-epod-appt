import { useState, useEffect, useCallback } from "react"; // react
import { useTrackingNo } from "@/context/TrackingNoContextProvider"; // ---- context

import ScannedHeading from "./scanned-heading"; // ---- components
import ScannedForms from "./scanned-forms"; // ---- components

import axios from "axios"; // ---- axios
import { toast } from "sonner"; // ---- toast
import { fetchTime } from "@/utils/getCurrentTime"; // utils for timezone db

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function ScannedItems() {
  // context to get the data from scan barcode (shipmentdata)
  const { trackingNoData } = useTrackingNo();

  // desctructure the data from the context (trackingNoData)
  const { trackingNo, loadNo, uom, productCodes = [] } = trackingNoData;

  // stored the pre-delivery-data
  const [preDeliveryData, setPreDeliveryData] = useState([]);

  // state for current date - received date (get the current date)
  const [currentDate, setCurrentDate] = useState("");

  // state for required fields
  const [receivedBy, setReceivedBy] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [receivedQuantity, setReceivedQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  // error state for certain fields
  const [receivedByError, setReceivedByError] = useState("");
  const [receivedQuantityError, setReceivedQuantityError] = useState("");
  const [selectedProductCodeError, setSelectedProductCodeError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [, setLoadingPreDelivery] = useState(false);

  // empty state for data fetched
  const [isScannedDataFieldEmpty, setIsScannedDataFieldEmpty] = useState("");

  // state to track the product code submitted
  const [submittedProductCodes, setSubmittedProductCodes] = useState([]);

  // selected product codes
  const availableProductCodes = productCodes.filter(
    (item) => !submittedProductCodes.includes(item.productCode)
  );

  // check if the button should be disabled
  const isButtonDisabled = availableProductCodes.length === 0 || isLoading;

  // fetch the pre delivery data
  const fetchPreDeliveryData = useCallback(async () => {
    setLoadingPreDelivery(true);
    try {
      const shipments = Array.isArray(trackingNoData)
        ? trackingNoData
        : [trackingNoData];
      if (!shipments.length) return;

      const requests = shipments.map((shipment) =>
        axios.get(`${API_ENDPOINT}/api/pre-delivery/${shipment.trackingNo}`)
      );
      const responses = await Promise.all(requests);
      const preDeliveryResults = responses.map((res) => res.data);
      setPreDeliveryData(preDeliveryResults);
    } catch (error) {
      console.error("Failed to fetch pre-delivery data:", error);
      toast.error(
        "We could not load your dashboard data. Please try again later.",
        {
          style: { backgroundColor: "#ff4d4d", color: "#fff" },
        }
      );
    } finally {
      setLoadingPreDelivery(false);
    }
  }, [trackingNoData]);

  // update the epodStatus in trackingNoData if the length of productCodes is equal to pre_delivery_products
  // const updateEPODStatus = useCallback(async () => {
  //   try {
  //     const response = await axios.patch(
  //       `${API_ENDPOINT}/api/shipment/${trackingNo}/update-epod-status`
  //     );
  //     if (response.status === 200) {
  //       console.log("EPOD status updated to delivered");
  //     }
  //   } catch (error) {
  //     console.error("Failed to update EPOD status:", error);
  //   }
  // }, [trackingNo]); // add dependencies that change

  const updateEPODStatus = useCallback(
    async (status) => {
      try {
        const response = await axios.patch(
          `${API_ENDPOINT}/api/shipment/${trackingNo}/update-epod-status`,
          { epodStatus: status } // Pass the status dynamically
        );
        if (response.status === 200) {
          console.log(`EPOD status updated to ${status}`);
        }
      } catch (error) {
        console.error(`Failed to update EPOD status to ${status}:`, error);
      }
    },
    [trackingNo] // Dependencies
  );

  // function to handle the pre-delivery data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check if fetched data is empty
    if (!trackingNo && !loadNo && !selectedProductCode && !uom) {
      setIsScannedDataFieldEmpty("No data found. Scan barcode first.");
      setIsLoading(false);
      return;
    }

    // check if they select a product code
    if (!selectedProductCode) {
      setSelectedProductCodeError("Please select a product code.");
      setIsLoading(false);
      return;
    }

    // check if required fields are empty
    if (!receivedBy && !receivedQuantity) {
      setReceivedByError("Received by field cannot be empty.");
      setReceivedQuantityError("Received quantity field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // check if received by field are empty
    if (!receivedBy) {
      setReceivedByError("Received by field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // check if received qty field are empty
    if (!receivedQuantity) {
      setReceivedQuantityError("Received quantity field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // find the selected product and get its shipped quantity
    const selectedProduct = productCodes.find(
      (item) => item.productCode === selectedProductCode
    );
    const shippedQty = selectedProduct ? selectedProduct.shippedQty : 0;

    // check if received quantity is greater than shipped quantity
    if (parseInt(receivedQuantity) > parseInt(shippedQty)) {
      setReceivedQuantityError(
        `Received quantity cannot exceed shipped quantity ${shippedQty}.`
      );

      setIsLoading(false);
      return;
    }

    // check if received quantity is less than shipped quantity
    if (parseInt(receivedQuantity) < parseInt(shippedQty)) {
      // check the remarks if its valid reason
      if (
        !remarks.trim() ||
        remarks.toLowerCase() === "n/a" ||
        remarks.toLowerCase() === "na"
      ) {
        setRemarksError(
          "Please provide a valid reason in the remarks when the received quantity is less than the shipped quantity."
        );
        setIsLoading(false);
        return;
      }

      // show the confirmation message
      const confirmProceed = window.confirm(
        `Received quantity is less than the shipped quantity ${shippedQty}. Do you want to proceed?`
      );

      // if user cancel
      if (!confirmProceed) {
        setIsLoading(false);
        return;
      }
    }

    // request to backend
    try {
      // JSON cannot handle file uploads, so we must use FormData to send files. (built-in)
      const formData = new FormData();
      formData.append("trackingNo", trackingNo);
      formData.append("loadNo", loadNo);
      formData.append("receivedDate", currentDate);
      formData.append("receivedBy", receivedBy);
      formData.append("productCode", selectedProductCode);
      formData.append("receivedQty", receivedQuantity);
      formData.append("uom", uom);
      formData.append("remarks", remarks);

      // Append images to formData
      uploadedImages.forEach((image) => {
        formData.append("image", image); // "image" should match backend field name
      });

      // send the data to the backend
      const response = await axios.post(
        `${API_ENDPOINT}/api/pre-delivery/createpre-delivery`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // check if response is successful
      if (response.status === 201) {
        toast.success("Successfully processed!", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        // add submitted code to the state
        setSubmittedProductCodes((prev) => [...prev, selectedProductCode]);
        setReceivedQuantity("");
        setRemarks("");
        setRemarksError("");
        setIsLoading(false);
        setUploadedImages([]);

        await fetchPreDeliveryData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.", {
        style: {
          backgroundColor: "#ff4d4d",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect for fetchPreDeliveryData
  useEffect(() => {
    fetchPreDeliveryData();
  }, [fetchPreDeliveryData]);

  // useEffect for update epodStatus
  // useEffect(() => {
  //   if (preDeliveryData.length > 0 && trackingNoData.productCodes.length > 0) {
  //     const preDeliveryProductsLength =
  //       preDeliveryData[0].pre_delivery_products?.length || 0;
  //     const productCodesLength = trackingNoData.productCodes.length;

  //     if (preDeliveryProductsLength === productCodesLength) {
  //       updateEPODStatus();
  //     }
  //   }
  // }, [preDeliveryData, trackingNoData.productCodes, updateEPODStatus]);

  useEffect(() => {
    if (preDeliveryData.length > 0) {
      const preDeliveryTrackingNoLength =
        preDeliveryData[0]?.pre_delivery_trackingNo?.length || 0;
      const preDeliveryProductsLength =
        preDeliveryData[0]?.pre_delivery_products?.length || 0;
      const productCodesLength = trackingNoData.productCodes?.length || 0;

      // If productCodes length matches pre_delivery_products, update EPOD status to "Delivered"
      if (preDeliveryProductsLength === productCodesLength) {
        updateEPODStatus("Delivered");
      }
      // Otherwise, if pre_delivery_trackingNo exists, update to "In Receiving"
      else if (preDeliveryTrackingNoLength > 0) {
        updateEPODStatus("In Receiving");
      }
    }
  }, [preDeliveryData, trackingNoData.productCodes, updateEPODStatus]);

  // useEffect for date/time
  useEffect(() => {
    const updateTime = async () => {
      const time = await fetchTime();
      if (time) setCurrentDate(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every 60 sec

    return () => clearInterval(interval);
  }, []);
  // clear the error when valid data is detected
  useEffect(() => {
    if (trackingNo || loadNo || selectedProductCode || uom) {
      setIsScannedDataFieldEmpty("");
    }
  }, [trackingNo, loadNo, selectedProductCode, uom]);

  // clear the field when component unmounts (menu changes)
  useEffect(() => {
    return () => {
      setReceivedBy("");
      setReceivedQuantity("");
      setRemarks("");
      setUploadedImages([]);

      setReceivedByError("");
      setReceivedQuantityError("");
      setRemarksError("");
    };
  }, [
    setReceivedBy,
    setReceivedQuantity,
    setRemarks,
    setUploadedImages,
    setReceivedByError,
    setReceivedQuantityError,
    setRemarksError,
  ]);

  // reset these field when a new scan is detected
  useEffect(() => {
    setReceivedBy("");
    setReceivedBy("");
    setReceivedQuantity("");
    setRemarks("");
    setUploadedImages([]);

    setReceivedByError("");
    setReceivedQuantityError("");
    setRemarksError("");
  }, [
    setReceivedBy,
    setReceivedQuantity,
    setRemarks,
    setUploadedImages,
    trackingNoData,
    setReceivedByError,
    setReceivedQuantityError,
    setRemarksError,
  ]);

  return (
    <div className="mt-5 py-5 px-2 rounded-md lg:w-3/5 lg:py-0 xl:w-2/3 lg:mt-0 ">
      <ScannedHeading />

      <div className="data_section mt-5">
        <ScannedForms
          trackingNo={trackingNo}
          isScannedDataFieldEmpty={isScannedDataFieldEmpty}
          loadNo={loadNo}
          currentDate={currentDate}
          receivedBy={receivedBy}
          setReceivedBy={setReceivedBy}
          receivedByError={receivedByError}
          setReceivedByError={setReceivedByError}
          selectedProductCode={selectedProductCode}
          setSelectedProductCode={setSelectedProductCode}
          selectedProductCodeError={selectedProductCodeError}
          setSelectedProductCodeError={setSelectedProductCodeError}
          availableProductCodes={availableProductCodes}
          receivedQuantity={receivedQuantity}
          setReceivedQuantity={setReceivedQuantity}
          receivedQuantityError={receivedQuantityError}
          setReceivedQuantityError={setReceivedQuantityError}
          uom={uom}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksError={remarksError}
          setRemarksError={setRemarksError}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}
