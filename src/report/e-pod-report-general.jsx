import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
import prics_logo from "../assets/nav_logo.png";

const styles = StyleSheet.create({
  page: { padding: 10 },
  section: { marginBottom: 20 },
  logo: {
    width: 150,
    height: 85,
    objectFit: "cover",
    objectPosition: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  textDate: { fontSize: 10, fontWeight: "normal", textAlign: "center" },

  tableHeader: { backgroundColor: "#ddd", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 4,
  },
  column: { flex: 1, fontSize: 8, paddingHorizontal: 2, textAlign: "center" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    color: "#333",
    textTransform: "uppercase",
  },
});

export default function GeneralEPODReport({ data, preDeliveryData }) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Image src={prics_logo} style={styles.logo} />
          <Text style={styles.header}>
            ELECTRONIC PROOF OF DELIVERY (e-POD) REPORT
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            - {new Date().toLocaleTimeString("en-US")}
          </Text>
          <Text style={styles.textDate}>Date & Time Generated</Text>
        </View>

        {/* Shipment Details Table */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          TRACKING NUMBER DETAILS
        </Text>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.column}>Tracking No</Text>
          <Text style={styles.column}>Shipped Date</Text>
          <Text style={styles.column}>Received Date</Text>
          <Text style={styles.column}>Waybill No</Text>
          <Text style={styles.column}>CV No</Text>
          <Text style={styles.column}>Plate No</Text>
          <Text style={styles.column}>Driver</Text>
          <Text style={styles.column}>Received By</Text>
          <Text style={styles.column}>Customer Name</Text>
          <Text style={styles.column}>Total CBM</Text>
          <Text style={styles.column}>Delivery Status</Text>
        </View>

        {data.map((item, index) => {
          const preDeliveryItem = preDeliveryData.find(
            (pre) => pre.pre_delivery_trackingNo === item.trackingNo
          );

          let status = "In Transit";
          if (preDeliveryItem) {
            if (preDeliveryItem.pre_delivery_trackingNo.length > 0) {
              status = "In Receiving";
            }
            if (
              preDeliveryItem.pre_delivery_products.length ===
              item.productCodes.length
            ) {
              status = "Delivered";
            }
          }
          return (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.trackingNo || "-"}</Text>
              <Text style={styles.column}>
                {item.shippedDate
                  ? new Date(item.shippedDate).toLocaleDateString("en-US")
                  : "-"}
              </Text>
              <Text style={styles.column}>
                {preDeliveryItem?.pre_delivery_receivedDate
                  ? new Date(
                      preDeliveryItem.pre_delivery_receivedDate
                    ).toLocaleDateString("en-US")
                  : "-"}
              </Text>
              <Text style={styles.column}>{item.waybillNo || "-"}</Text>
              <Text style={styles.column}>{item.cvNo || "-"}</Text>
              <Text style={styles.column}>{item.plateNo || "-"}</Text>
              <Text style={styles.column}>{item.driverName || "-"}</Text>
              <Text style={styles.column}>
                {preDeliveryItem?.pre_delivery_receivedBy || "-"}
              </Text>
              <Text style={styles.column}>{item.customerName || "-"}</Text>
              <Text style={styles.column}>{item.totalCbm || "-"} kg</Text>
              <Text style={styles.column}>{status}</Text>
            </View>
          );
        })}

        {/* Product Details Table */}
        <Text style={[styles.sectionTitle, { marginTop: 50 }]}>
          PRODUCT CODES DETAILS
        </Text>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.column}>Tracking No</Text>
          <Text style={styles.column}>Product Code</Text>
          <Text style={styles.column}>Shipped QTY</Text>
          <Text style={styles.column}>Actual Received QTY</Text>
          <Text style={styles.column}>Remarks</Text>
        </View>

        {data.map((item, index) => {
          const preDeliveryItem = preDeliveryData.find(
            (pre) => pre.pre_delivery_trackingNo === item.trackingNo
          );

          return (
            <View key={index}>
              {item.productCodes.map((product, productIndex) => (
                <View key={productIndex} style={styles.row}>
                  {/* Show Tracking No only for the first product */}
                  {productIndex === 0 ? (
                    <Text style={[styles.column, styles.trackingNo]}>
                      {item.trackingNo || "-"}
                    </Text>
                  ) : (
                    <Text style={[styles.column, styles.emptyColumn]}></Text>
                  )}

                  <Text style={styles.column}>
                    {product.productCode || "-"}
                  </Text>
                  <Text style={styles.column}>{product.shippedQty || "-"}</Text>
                  <Text style={styles.column}>
                    {preDeliveryItem?.pre_delivery_products[productIndex]
                      ?.receivedQty || "-"}
                  </Text>
                  <Text style={styles.column}>
                    {preDeliveryItem?.pre_delivery_products[productIndex]
                      ?.remarks || "-"}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

// PropTypes validation
GeneralEPODReport.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      trackingNo: PropTypes.string.isRequired,
      shippedDate: PropTypes.string.isRequired,
      waybillNo: PropTypes.string.isRequired,
      driverName: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      cvNo: PropTypes.string,
      plateNo: PropTypes.string,
      totalCbm: PropTypes.number, // Added this
      productCodes: PropTypes.arrayOf(
        PropTypes.shape({
          productCode: PropTypes.string.isRequired,
          shippedQty: PropTypes.number.isRequired,
          receivedQty: PropTypes.number,
          remarks: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  preDeliveryData: PropTypes.arrayOf(
    PropTypes.shape({
      pre_delivery_trackingNo: PropTypes.string.isRequired,
      pre_delivery_receivedDate: PropTypes.string,
      pre_delivery_receivedBy: PropTypes.string,
      pre_delivery_products: PropTypes.arrayOf(
        PropTypes.shape({
          productCode: PropTypes.string.isRequired,
          receivedQty: PropTypes.number,
          remarks: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};
