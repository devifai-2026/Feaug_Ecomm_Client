// InvoicePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d97706", // amber-600
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#1f2937", // gray-900
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 10,
    color: "#6b7280", // gray-500
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    color: "#1f2937", // gray-900
    fontWeight: "medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6", // gray-100
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db", // gray-300
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // gray-200
  },
  col1: { width: "50%" },
  col2: { width: "20%" },
  col3: { width: "30%" },
  totalSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#d1d5db",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d97706", // amber-600
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
});

const InvoicePDF = ({ order }) => {
  const subtotal = order.subtotal || 0;
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const shipping = order.shippingCharge || 0;
  const grandTotal = order.amount || 0;
  const promoCode = order.promoCode;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>FEAUAG JEWELLERY</Text>
          <Text style={{ fontSize: 10, color: "#6b7280", marginTop: 5 }}>
            Luxury & Craftsmanship Since 1950
          </Text>
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Order Information */}
        <View style={[styles.row, { marginBottom: 20 }]}>
          <View style={styles.section}>
            <Text style={styles.label}>INVOICE NUMBER</Text>
            <Text style={styles.value}>{order.orderNo}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>DATE</Text>
            <Text style={styles.value}>
              {new Date(order.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>STATUS</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    order.status === "delivered"
                      ? "#10b981"
                      : order.status === "shipped"
                        ? "#3b82f6"
                        : order.status === "processing"
                          ? "#f59e0b"
                          : "#ef4444",
                },
              ]}
            >
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Billing & Shipping Info */}
        <View style={[styles.row, { marginBottom: 30 }]}>
          <View style={styles.section}>
            <Text style={styles.label}>BILLING ADDRESS</Text>
            <Text style={styles.value}>{order.shippingAddress}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>SHIPPING ADDRESS</Text>
            <Text style={styles.value}>{order.shippingAddress}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={[styles.value, styles.col1]}>DESCRIPTION</Text>
            <Text style={[styles.value, styles.col2]}>QUANTITY</Text>
            <Text style={[styles.value, styles.col3]}>AMOUNT (₹)</Text>
          </View>

          {order.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.value, styles.col1]}>{item.name}</Text>
              <Text style={[styles.value, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.value, styles.col3]}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.value}>Subtotal</Text>
            <Text style={styles.value}>
              ₹{subtotal.toLocaleString("en-IN")}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.value, { color: "#10b981" }]}>
                Discount {promoCode ? `(${promoCode})` : ""}
              </Text>
              <Text style={[styles.value, { color: "#10b981" }]}>
                -₹{discount.toLocaleString("en-IN")}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.value}>Shipping</Text>
            <Text
              style={[styles.value, shipping === 0 ? { color: "#10b981" } : {}]}
            >
              {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.value}>GST (3%)</Text>
            <Text style={styles.value}>
              ₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 10 }]}>
            <Text style={styles.grandTotal}>Total Amount</Text>
            <Text style={styles.grandTotal}>
              ₹{grandTotal.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Payment & Tracking Info */}
        <View style={[styles.row, { marginTop: 30 }]}>
          <View style={styles.section}>
            <Text style={styles.label}>PAYMENT METHOD</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
          </View>
          {order.trackingId && (
            <View style={styles.section}>
              <Text style={styles.label}>TRACKING ID</Text>
              <Text style={styles.value}>{order.trackingId}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for shopping with FEAUAG Jewellery</Text>
          <Text>
            For any queries, contact: support@feauag.com | +91 98765 43210
          </Text>
          <Text>
            This is a computer-generated invoice. No signature required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
