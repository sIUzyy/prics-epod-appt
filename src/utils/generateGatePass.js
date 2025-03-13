import JsBarcode from "jsbarcode"; // library to generate a barcode

// handle to generate a gatepass based on appointment id
export const generateGatePass = (apptId) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Create a temporary barcode canvas
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, apptId, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });

  const padding = 20;
  canvas.width = barcodeCanvas.width;
  canvas.height = barcodeCanvas.height + padding;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw "Gatepass" text on top
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GATEPASS", canvas.width / 2, 20);

  // Draw the barcode below the text
  ctx.drawImage(barcodeCanvas, 0, padding);

  // Convert to image and trigger download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `appointment_id_${apptId}.png`;
  link.click();
};
