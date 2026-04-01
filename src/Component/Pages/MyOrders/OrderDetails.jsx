import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaTruck,
  FaCheckCircle,
  FaCreditCard,
  FaDownload,
  FaRedo,
  FaStar,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import InvoicePDF from "./InvoicePDF";
import orderApi from "../../../apis/orderApi";
import userApi from "../../../apis/user/userApi";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  // Fetch order details from API
  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    // Check if user is logged in
    if (!userApi.isAuthenticated()) {
      toast.error("Please login to view order details");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    orderApi.getOrder({
      orderId,
      setLoading,
      onSuccess: (data) => {
        if (data.success && data.data) {
          window.scrollTo(0, 0);
          const orderData = data.data.order || data.data;

          // Helper to get full image URL
          const getImageUrl = (imageUrl) => {
            if (!imageUrl) return "https://via.placeholder.com/150";
            if (imageUrl.startsWith("http")) return imageUrl;
            const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
            return `${backendUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
          };

          const transformedOrder = {
            id: orderData._id || orderData.id,
            orderNo: orderData.orderId || `ORD-${(orderData._id || orderData.id).slice(-8).toUpperCase()}`,
            date: orderData.createdAt,
            subtotal: orderData.subtotal || 0,
            discount: orderData.discount || 0,
            shippingCharge: orderData.shippingCharge || 0,
            tax: orderData.tax || 0,
            amount: orderData.grandTotal || orderData.total || 0,
            promoCode: orderData.promoCode,
            status: orderData.status || "pending",
            shippingStatus: orderData.shippingStatus,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod || "Online",
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: orderData.razorpayPaymentId,
            items: (orderData.items || []).map((item) => ({
              id: item.product?._id || item.product || item.productId,
              name: item.productName || item.product?.name || item.name || "Product",
              quantity: item.quantity || 1,
              price: item.price || 0,
              image: getImageUrl(item.productImage || item.product?.images?.[0]?.url),
            })),
            shippingAddress: (() => {
              const addresses = orderData.addresses || [];
              const shipping = addresses.find(a => a.type === 'shipping') || {};
              return {
                street: [shipping.addressLine1, shipping.addressLine2, shipping.landmark].filter(Boolean).join(', '),
                city: shipping.city,
                state: shipping.state,
                postalCode: shipping.pincode,
                country: shipping.country,
                phone: shipping.phone,
                name: shipping.name,
                email: shipping.email,
              };
            })(),
            trackingId: orderData.trackingNumber || orderData.shiprocketAWB || null,
            shiprocketAWB: orderData.shiprocketAWB || null,
            trackingUrl: orderData.trackingUrl || (orderData.shiprocketAWB ? `https://shiprocket.co/tracking/${orderData.shiprocketAWB}` : null),
            courierName: orderData.courierName || null,
            estimatedDelivery: orderData.estimatedDelivery || null,
            deliveredAt: orderData.deliveredAt || null,
          };

          setOrder(transformedOrder);
        } else {
          setError("Order not found");
        }
      },
      onError: (err) => {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      },
    });
  }, [orderId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <FaCheckCircle className="text-green-500 text-xl" />;
      case "shipped": return <FaTruck className="text-blue-500 text-xl" />;
      case "pending":
      case "confirmed":
      case "processing": return <FaClock className="text-yellow-500 text-xl" />;
      case "cancelled":
      case "returned":
      case "refunded": return <FaTimesCircle className="text-red-500 text-xl" />;
      default: return <FaClock className="text-gray-500 text-xl" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered": return "Delivered";
      case "shipped": return "Shipped";
      case "pending": return "Pending";
      case "confirmed": return "Confirmed";
      case "processing": return "Processing";
      case "cancelled": return "Cancelled";
      case "returned": return "Returned";
      case "refunded": return "Refunded";
      default: return "Pending";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return price || "₹0";
  };

  const handleWriteReview = (productId) => {
    if (productId) {
      navigate(`/product/${productId}?review=true`);
    } else {
      toast.error("Product information not available");
    }
  };

  const handleCancelOrder = () => {
    Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C19A6B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      background: "#fff",
      color: "#1f2937",
      customClass: {
        title: "text-lg font-bold uppercase tracking-widest",
        htmlContainer: "text-sm",
        confirmButton: "px-8 py-3 bg-[#C19A6B] text-white text-[10px] font-bold uppercase tracking-widest mr-4",
        cancelButton: "px-8 py-3 bg-white border border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        setCancelling(true);
        orderApi.cancelOrder({
          orderId: order.id,
          reason: "Customer requested cancellation",
          onSuccess: (data) => {
            if (data.success) {
              setOrder((prev) => ({ ...prev, status: "cancelled" }));
              Swal.fire({
                title: "Cancelled!",
                text: "Your order has been successfully cancelled.",
                icon: "success",
                confirmButtonColor: "#C19A6B",
                showConfirmButton: false,
                timer: 2000
              });
            }
          },
          onError: (err) => {
            toast.error(err.message || "Failed to cancel order");
          },
        });
        setCancelling(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C19A6B]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{error || "Order Not Found"}</h2>
        <button
          onClick={() => navigate("/myOrders")}
          className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/myOrders")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#C19A6B] transition-colors"
            >
              <FaArrowLeft className="text-[10px]" />
              Back to Orders
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 mb-4">
                Order <span className="italic text-[#C19A6B]">#{order.orderNo}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-2">
                  <FaClock className="text-[10px] text-gray-300" />
                  Placed {formatDate(order.date)}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-gray-300" />
                  {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
               <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-900 text-white shadow-xl shadow-black/5">
                 {getStatusText(order.status)}
               </span>
               <p className="text-3xl font-bold text-[#C19A6B]">
                 {formatPrice(order.amount)}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Column 1: Journey & Logistics */}
          <div className="lg:col-span-4 space-y-16">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 pb-4 border-b border-gray-100">
                Order Journey
              </h2>
              <div className="relative pl-10">
                <div className="absolute left-[13px] top-6 bottom-0 w-[1px] bg-gray-100"></div>
                
                <div className="space-y-16">
                  {/* Delivered Step */}
                  {["delivered"].includes(order.status) && (
                    <div className="relative group">
                       <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-lg flex items-center justify-center z-10">
                         <FaCheckCircle className="text-white text-[10px]" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-900 mb-1">Delivered</p>
                         <p className="text-xs text-gray-500">{formatDate(order.deliveredAt)}</p>
                         <p className="text-xs text-gray-400 mt-2 leading-relaxed">High-five! Your order has been delivered.</p>
                       </div>
                    </div>
                  )}

                  {/* Shipped Step */}
                  {["shipped", "delivered"].includes(order.status) && (
                    <div className="relative group">
                       <div className={`absolute -left-[37px] top-0 w-8 h-8 rounded-full ${order.status === 'shipped' ? 'bg-[#C19A6B]' : 'bg-gray-200'} border-4 border-white shadow-lg flex items-center justify-center z-10 transition-colors`}>
                         <FaTruck className="text-white text-[10px]" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-900 mb-1">On its Way</p>
                         <p className="text-xs text-gray-400 tracking-tight">
                           {order.courierName || 'In Transit'} • {order.trackingId || 'Preparing label'}
                         </p>
                       </div>
                    </div>
                  )}

                  {/* Processing Step */}
                  {["confirmed", "processing", "shipped", "delivered"].includes(order.status) && (
                    <div className="relative group">
                       <div className={`absolute -left-[37px] top-0 w-8 h-8 rounded-full ${["confirmed", "processing"].includes(order.status) ? 'bg-[#C19A6B]' : 'bg-gray-200'} border-4 border-white shadow-lg flex items-center justify-center z-10 transition-colors`}>
                         <FaClock className="text-white text-[10px]" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-900 mb-1">Processing</p>
                         <p className="text-xs text-gray-400">Preparing your order with care.</p>
                       </div>
                    </div>
                  )}

                  {/* Initial Step */}
                  <div className="relative group">
                     <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center z-10">
                       <FaCheckCircle className="text-white text-[10px]" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-900 mb-1">Order Placed</p>
                       <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                     </div>
                  </div>
                </div>
              </div>

              {order.trackingUrl && (
                <div className="mt-12">
                   <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C19A6B] transition-all"
                  >
                    Track Live Shipment
                  </a>
                </div>
              )}
            </section>

            {/* Address & Payment Info */}
            <section className="pt-16 border-t border-gray-100 space-y-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Delivery Address</h3>
                <div className="text-sm leading-relaxed text-gray-600">
                  <p className="font-bold text-gray-900 mb-1">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="mt-4 flex items-center gap-2">
                    <FaPhone className="text-[10px] text-[#C19A6B]/50" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Payment Info</h3>
                <div className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                   <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                     <FaCreditCard className="text-[#C19A6B] text-xs" />
                   </div>
                   <div>
                     <p className="capitalize">{order.paymentMethod}</p>
                     <p className="text-xs text-gray-400 font-normal">Transaction Secured</p>
                   </div>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Items & Summary */}
          <div className="lg:col-span-8">
            <section className="bg-gray-50/50 rounded-3xl p-8 md:p-12 border border-gray-100">
               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 pb-4 border-b border-gray-200/50">
                 Order Contents
               </h2>
               
               <div className="space-y-12 mb-16">
                 {order.items.map((item, index) => (
                   <div key={index} className="flex gap-8 group">
                      <div className="w-24 h-32 md:w-32 md:h-40 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                         <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <h4 className="text-lg md:text-xl font-medium text-gray-900 mb-2">{item.name}</h4>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-end justify-between">
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Price: {formatPrice(item.price)}</p>
                           <p className="text-xl font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>

               <div className="border-t border-dashed border-gray-300 pt-10 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.subtotal || order.amount)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600 font-bold">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {order.shippingCharge === 0 ? 'Complementary' : formatPrice(order.shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-10 mt-6 border-t border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Total Charged</span>
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(order.amount)}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
                  <PDFDownloadLink
                    document={<InvoicePDF order={order} />}
                    fileName={`invoice-${order.orderNo}.pdf`}
                    className="flex items-center justify-center gap-3 px-8 py-5 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                  >
                    {({ loading }) => (
                      <>
                        <FaDownload />
                        {loading ? 'Preparing...' : 'Download Invoice'}
                      </>
                    )}
                  </PDFDownloadLink>

                  {order.status === "delivered" && (
                    <button
                      onClick={() => handleWriteReview(order.items[0]?.id)}
                      className="flex items-center justify-center gap-3 px-8 py-5 bg-[#C19A6B] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#A9854F] transition-all shadow-lg"
                    >
                      <FaStar />
                      Rate Items
                    </button>
                  )}

                  {["pending", "confirmed", "processing"].includes(order.status) && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="flex items-center justify-center gap-3 px-8 py-5 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      <FaTimesCircle />
                      {cancelling ? 'Processing...' : 'Cancel Order'}
                    </button>
                  )}
               </div>

               <div className="mt-12 text-center">
                  <p className="text-xs text-gray-400 mb-6">Need assistance?</p>
                  <div className="flex justify-center gap-8">
                     <a href="tel:+919876543210" className="text-gray-900 hover:text-[#C19A6B] transition-colors">
                        <FaPhone className="mx-auto mb-2 text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Call</span>
                     </a>
                     <a href="mailto:support@feauag.com" className="text-gray-900 hover:text-[#C19A6B] transition-colors">
                        <FaEnvelope className="mx-auto mb-2 text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                     </a>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
