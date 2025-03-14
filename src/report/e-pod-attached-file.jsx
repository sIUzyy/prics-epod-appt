import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// image
import prics_logo from "../assets/nav_logo.png";

// props-validation
import PropTypes from "prop-types";

// document styling
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  label: { fontSize: 10, marginVertical: 5, fontWeight: "bold" },
});

export default function AttachedFile({ selectedProductCode, preDeliveryData }) {
  const uniqueImages = preDeliveryData
    .flatMap((delivery) =>
      delivery.pre_delivery_products.filter(
        (product) => product.productCode === selectedProductCode
      )
    )
    .flatMap((filteredProduct) => filteredProduct.uploadedImages || []) // Get all images
    .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={prics_logo} style={styles.logo} />
          <Text style={styles.header}>
            ELECTRONIC PROOF OF DELIVERY (e-POD) ATTACHED FILE
          </Text>
        </View>

        {/* display the tracking no */}
        {preDeliveryData.length > 0 && (
          <Text style={styles.label}>
            TRACKING NUMBER: {preDeliveryData[0].pre_delivery_trackingNo}
          </Text>
        )}

        {/* display selected Product Code */}
        <Text style={styles.label}>PRODUCT CODE: {selectedProductCode}</Text>

        {/*display image*/}
        {uniqueImages.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            {uniqueImages.map((image, index) => (
              <Image
                key={index}
                // src={`http://localhost:5000/${image}`}
                src={`https://prics-epod-backend.onrender.com/${image}`}
                style={{
                  width: 400,
                  height: 300,
                  objectFit: "contain",
                  marginBottom: 5,
                }}
              />
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

// Update PropTypes validation
AttachedFile.propTypes = {
  selectedProductCode: PropTypes.string.isRequired,
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
