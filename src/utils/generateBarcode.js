import JsBarcode from "jsbarcode"; // library to generate a barcode

// handle to generate a barcode based on tracking no
export const generateBarcode = (trackingNo) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, trackingNo, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });

  // convert to image and trigger download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `epod_barcode_${trackingNo}.png`;
  link.click();
};
