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
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#C19A6B",
    paddingBottom: 20,
    marginBottom: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C19A6B",
    letterSpacing: 2,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  table: {
    marginTop: 40,
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colDesc: { width: "50%" },
  colQty: { width: "20%", textAlign: "right" },
  colPrice: { width: "30%", textAlign: "right" },
  totalSection: {
    marginLeft: "Auto",
    width: "40%",
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#C19A6B",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C19A6B",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
    marginBottom: 4,
  },
});

const InvoicePDF = ({ order }) => {
  const subtotal = order.subtotal || 0;
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const shipping = order.shippingCharge || 0;
  const grandTotal = order.amount || 0;

  // Format addressing properly
  const address = order.shippingAddress;
  const addressString = address && typeof address === 'object'
    ? `${address.name}\n${address.street}\n${address.city}, ${address.state} ${address.postalCode}\nPhone: ${address.phone}`
    : typeof address === 'string' ? address : "Address N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>FEAUAG</Text>
            <Text style={[styles.footerText, { color: "#C19A6B" }]}>Luxury Jewellery Experience</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.value}>#{order.orderNo}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>{addressString}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Ship To</Text>
            <Text style={styles.value}>{addressString}</Text>
          </View>
          <View style={{ flex: 0.5, textAlign: "right" }}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(order.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.label, styles.colDesc, { marginBottom: 0 }]}>Description</Text>
            <Text style={[styles.label, styles.colQty, { marginBottom: 0 }]}>Qty</Text>
            <Text style={[styles.label, styles.colPrice, { marginBottom: 0 }]}>Price (Rs.)</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.value, styles.colDesc]}>{item.name}</Text>
              <Text style={[styles.value, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.value, styles.colPrice]}>{item.price.toLocaleString("en-IN")}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>Rs.{subtotal.toLocaleString("en-IN")}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.label, { color: "#10b981" }]}>Discount Privilege</Text>
              <Text style={[styles.value, { color: "#10b981" }]}>-Rs.{discount.toLocaleString("en-IN")}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>{shipping === 0 ? "Complimentary" : `Rs.${shipping.toLocaleString("en-IN")}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Tax (GST 3%)</Text>
            <Text style={styles.value}>Rs.{tax.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>Rs.{grandTotal.toLocaleString("en-IN")}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for choosing FEAUAG Jewellery.</Text>
          <Text style={styles.footerText}>This is a computer-generated invoice. For support, email support@feauag.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
