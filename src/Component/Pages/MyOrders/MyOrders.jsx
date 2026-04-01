import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaDownload,
  FaRedo,
  FaStar,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaRupeeSign,
  FaBoxOpen,
  FaCreditCard,
  FaChevronRight,
  FaChevronDown,
  FaPhone,
  FaMapMarkerAlt,
  FaChevronLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import orderApi from "../../../apis/orderApi";
import userApi from "../../../apis/user/userApi";

const MyOrders = () => {
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalSpent: 0,
    pendingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    totalOrders: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalOrders: 0,
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      // Check if user is logged in
      if (!userApi.isAuthenticated()) {
        toast.error("Please login to view your orders");
        navigate("/login");
        return;
      }

      setLoading(true);

      orderApi.getUserOrders({
        params: {
          limit: pagination.limit,
          page: pagination.page,
          sort: "-createdAt",
        },
        setLoading,
        onSuccess: (data) => {
          if (data.success && data.data) {
            window.scrollTo(0, 0);
            const ordersData = data.data.orders || data.data || [];

            // Helper to get full image URL
            const getImageUrl = (imageUrl) => {
              if (!imageUrl) return "https://via.placeholder.com/150";
              if (imageUrl.startsWith("http")) return imageUrl;
              // Prepend backend URL for relative paths
              const backendUrl =
                import.meta.env.VITE_API_URL || "http://localhost:5001";
              return `${backendUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            };

            const transformedOrders = ordersData.map((order) => ({
              id: order._id || order.id,
              orderNo:
                order.orderId ||
                `ORD-${(order._id || order.id).slice(-8).toUpperCase()}`,
              date: order.createdAt,
              amount: order.grandTotal || order.total || 0,
              status: order.status || "pending",
              shippingStatus: order.shippingStatus,
              paymentStatus: order.paymentStatus,
              items: (order.items || []).map((item) => ({
                id: item.product?._id || item.product || item.productId,
                name:
                  item.productName ||
                  item.product?.name ||
                  item.name ||
                  "Product",
                quantity: item.quantity || 1,
                price: item.price || 0,
                image: getImageUrl(
                  item.productImage || item.product?.images?.[0]?.url,
                ),
              })),
              shippingAddress: (() => {
                const addresses = order.addresses || [];
                const shipping = addresses.find(a => a.type === 'shipping');
                if (shipping) {
                  return [shipping.name, shipping.addressLine1, shipping.landmark, shipping.city, `${shipping.state} - ${shipping.pincode}`, shipping.country].filter(Boolean).join(', ');
                }
                return "Address not available";
              })(),
              paymentMethod: order.paymentMethod || "Online",
              trackingId: order.trackingNumber || null,
              estimatedDelivery: order.estimatedDelivery || null,
              deliveredAt: order.deliveredAt || null,
            }));

            setOrders(transformedOrders);
            setPagination((prev) => ({
              ...prev,
              totalPages: Math.ceil((data.total || 0) / prev.limit),
              totalOrders: data.total || 0,
            }));

            if (data.data.stats) {
              setOrderStats({
                ...data.data.stats,
                totalOrders: data.total || 0,
              });
            }
          } else {
            setOrders([]);
          }
        },
        onError: (err) => {
          console.error("Error fetching orders:", err);
          toast.error("Failed to load orders");
          setOrders([]);
        },
      });
    };

    fetchOrders();
  }, [navigate, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: pagination.totalOrders,
      icon: <FaHistory className="text-[#C19A6B]" />,
    },
    {
      label: "Total Spent",
      value: `₹${(orderStats.totalSpent || 0).toLocaleString("en-IN")}`,
      icon: <FaRupeeSign className="text-[#C19A6B]" />,
    },
    {
      label: "Pending",
      value: orderStats.pendingCount || 0,
      icon: <FaClock className="text-[#C19A6B]" />,
    },
    {
      label: "Delivered",
      value: orderStats.deliveredCount || 0,
      icon: <FaCheckCircle className="text-[#C19A6B]" />,
    },
  ];

  const filters = [
    { key: "all", label: "All", count: pagination.totalOrders },
    {
      key: "processing",
      label: "Processing",
      count: orderStats.pendingCount || 0,
    },
    {
      key: "shipped",
      label: "Shipped",
      count: orderStats.shippedCount || 0,
    },
    {
      key: "delivered",
      label: "Delivered",
      count: orderStats.deliveredCount || 0,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: orderStats.cancelledCount || 0,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    let matchesFilter = activeFilter === "all";
    if (activeFilter === "processing") {
      matchesFilter = ["pending", "confirmed", "processing"].includes(
        order.status,
      );
    } else if (activeFilter === "cancelled") {
      matchesFilter = ["cancelled", "returned", "refunded"].includes(
        order.status,
      );
    } else if (activeFilter !== "all") {
      matchesFilter = order.status === activeFilter;
    }

    const matchesSearch =
      searchQuery === "" ||
      order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (order) => {
    navigate(`/orderDetails/${order.id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="text-green-600" />;
      case "shipped":
        return <FaTruck className="text-blue-600" />;
      case "pending":
      case "confirmed":
      case "processing":
        return <FaClock className="text-amber-600" />;
      case "cancelled":
      case "returned":
      case "refunded":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "pending":
      case "confirmed":
      case "processing":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "cancelled":
      case "returned":
      case "refunded":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      case "returned":
        return "Returned";
      case "refunded":
        return "Refunded";
      default:
        return "Pending";
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

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleReorder = (order) => {
    // Add items to cart (this would need cart context integration)
    toast("Reorder feature coming soon!", { icon: "\u2139\uFE0F" });
  };

  const handleTrackOrder = (orderId) => {
    orderApi.trackOrder({
      orderId,
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Order tracking details loaded");
          // Could show a modal with tracking info
        }
      },
      onError: () => {
        toast.error("Failed to load tracking details");
      },
    });
  };

  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be reversed.",
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
        confirmButton: "px-6 py-2 bg-[#C19A6B] text-white text-[10px] font-bold uppercase tracking-widest mr-3",
        cancelButton: "px-6 py-2 bg-white border border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        orderApi.cancelOrder({
          orderId,
          reason: "Customer requested cancellation",
          onSuccess: (data) => {
            if (data.success) {
              Swal.fire({
                title: "Cancelled!",
                text: "Your order has been successfully cancelled.",
                icon: "success",
                confirmButtonColor: "#C19A6B",
                showConfirmButton: false,
                timer: 2000
              });
              // Update the order in state
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === orderId ? { ...o, status: "cancelled" } : o,
                ),
              );
            }
          },
          onError: (err) => {
            toast.error(err.message || "Failed to cancel order");
          },
        });
      }
    });
  };

  const handleWriteReview = (productId) => {
    if (productId) {
      navigate(`/product/${productId}?review=true`);
    } else {
      toast.error("Product information not available");
    }
  };

  const handleCallSupport = () => {
    window.location.href = "tel:+919876543210";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-100 w-48 mb-2 rounded"></div>
            <div className="w-16 h-[2px] bg-gray-200 mb-8"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-5 animate-pulse">
                <div className="h-8 bg-gray-100 w-16 mb-2 rounded"></div>
                <div className="h-4 bg-gray-100 w-24 rounded"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-6 animate-pulse">
                <div className="h-5 bg-gray-100 w-32 mb-4 rounded"></div>
                <div className="h-14 bg-gray-50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-2">
              My Orders
            </h1>
            <div className="w-16 h-[2px] bg-[#C19A6B] mb-2"></div>
            <p className="text-sm text-gray-400 tracking-wide">
              Track and manage all your jewelry purchases
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <FaBoxOpen className="text-[#C19A6B]" />
            <span>{orders.length} Orders</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">Lifetime purchases</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C19A6B]/10 flex items-center justify-center text-lg group-hover:bg-[#C19A6B] group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-medium text-gray-900 leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-[0.1em] font-semibold">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 mb-8 shadow-sm">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm group-focus-within:text-[#C19A6B] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number or product name..."
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 focus:border-[#C19A6B] transition-all"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-[#C19A6B] text-xs" />
                <span className="text-sm font-medium text-gray-600">Filters</span>
              </div>
              <FaChevronDown
                className={`text-gray-400 text-xs transform transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => {
                      setActiveFilter(filter.key);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                      activeFilter === filter.key
                        ? "bg-[#C19A6B] text-white shadow-lg shadow-[#C19A6B]/20 scale-105"
                        : "bg-white text-gray-500 border border-gray-100 hover:border-[#C19A6B]/40 hover:text-[#C19A6B]"
                    }`}
                  >
                    {filter.label} <span className="opacity-60">({filter.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  activeFilter === filter.key
                    ? "bg-[#C19A6B] text-white shadow-lg shadow-[#C19A6B]/20 scale-105"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-[#C19A6B]/40 hover:text-[#C19A6B] hover:shadow-sm"
                }`}
              >
                {filter.label} <span className="opacity-60 ml-1">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="border border-gray-100 rounded-lg p-10 text-center">
              <FaBoxOpen className="text-3xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No orders found
              </h3>
              <p className="text-sm text-gray-400">
                {orders.length === 0
                  ? "You haven't placed any orders yet."
                  : "No orders match your current filters or search."}
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate("/categories")}
                  className="mt-5 px-6 py-2 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#A9854F] transition-colors"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Order Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-gray-900 text-sm tracking-wide">
                          {order.orderNo}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-300" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatPrice(order.amount)}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* First Item Preview */}
                  {order.items.length > 0 && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                      <div className="w-11 h-11 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">
                          {order.items[0].name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {order.items[0].quantity}
                        </p>
                        {order.items.length > 1 && (
                          <p className="text-xs text-[#C19A6B] mt-0.5">
                            + {order.items.length - 1} more item(s)
                          </p>
                        )}
                      </div>
                      <FaChevronRight
                        className={`text-gray-300 text-xs transform transition-transform ${expandedOrder === order.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    {/* Order Items */}
                    <div className="mb-4 pt-4">
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/150";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Qty: {item.quantity} &middot; {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-[#C19A6B] text-xs mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Shipping Address
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.shippingAddress}
                          </p>
                        </div>
                      </div>

                      {order.trackingId && (
                        <div className="flex items-center gap-2">
                          <FaTruck className="text-[#C19A6B] text-xs" />
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Tracking ID</p>
                            <p className="text-sm text-gray-700">
                              {order.trackingId}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium tracking-wide bg-[#C19A6B] text-white rounded-lg hover:bg-[#A9854F] transition-colors"
                      >
                        <FaEye className="text-[10px]" />
                        View Details
                      </button>

                      {order.status === "delivered" && (
                        <>
                          {/* <button
                            onClick={() => handle(order)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-100"
                          >
                            <FaRedo className="text-[10px]" />
                            Reorder
                          </button> */}
                          <button
                            onClick={() =>
                              handleWriteReview(order.items[0]?.id)
                            }
                            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-[#C19A6B] rounded-lg border border-[#C19A6B]/30 hover:bg-[#C19A6B]/5 transition-colors"
                          >
                            <FaStar className="text-[10px]" />
                            Review
                          </button>
                        </>
                      )}

                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-green-700 rounded-lg border border-green-200 hover:bg-green-50 transition-colors col-span-2"
                        >
                          <FaTruck className="text-[10px]" />
                          Track Order
                        </button>
                      )}

                      {["pending", "confirmed", "processing"].includes(
                        order.status,
                      ) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-red-600 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <FaTimesCircle className="text-[10px]" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Orders Table */}
        <div className="hidden md:block bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {filteredOrders.length === 0 ? (
            <div className="p-14 text-center">
              <FaBoxOpen className="text-3xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No orders found
              </h3>
              <p className="text-sm text-gray-400">
                {orders.length === 0
                  ? "You haven't placed any orders yet."
                  : "No orders match your current filters or search."}
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate("/categories")}
                  className="mt-5 px-6 py-2 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#A9854F] transition-colors"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="text-left p-4 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left p-4 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left p-4 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-4 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-gray-50 hover:bg-[#C19A6B]/[0.02] transition-colors duration-150"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-gray-50 rounded overflow-hidden">
                              {order.items.length > 0 && (
                                <img
                                  src={order.items[0].image}
                                  alt={order.items[0].name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/150";
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {order.orderNo}
                            </div>
                            <div className="text-xs text-gray-400">
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </div>
                            {order.items.length > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {order.items[0].name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FaCalendarAlt className="text-gray-300 text-xs" />
                          {formatDate(order.date)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 text-sm">
                          {formatPrice(order.amount)}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <FaCreditCard className="text-gray-300" />
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        {order.trackingId && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            Track ID: {order.trackingId}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-1.5 px-3 py-1 text-xs text-[#C19A6B] hover:bg-[#C19A6B]/5 rounded transition-colors duration-200 font-medium"
                          >
                            <FaEye className="text-[10px]" />
                            View Details
                          </button>

                          {order.status === "delivered" && (
                            <>
                              <button
                                onClick={() =>
                                  handleWriteReview(order.items[0]?.id)
                                }
                                className="flex items-center gap-1.5 px-3 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200"
                              >
                                <FaStar className="text-[10px]" />
                                Write Review
                              </button>
                            </>
                          )}

                          {order.status === "shipped" && (
                            <button
                              onClick={() => handleTrackOrder(order.id)}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                            >
                              <FaTruck className="text-[10px]" />
                              Track Order
                            </button>
                          )}

                          {["pending", "confirmed", "processing"].includes(
                            order.status,
                          ) && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                            >
                              <FaTimesCircle className="text-[10px]" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-1.5 pb-6">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg border ${
                pagination.page === 1
                  ? "bg-white text-gray-300 border-gray-100 cursor-not-allowed"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#C19A6B]/40 hover:text-[#C19A6B]"
              } transition-colors duration-200`}
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] md:max-w-none px-1 scrollbar-hide">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[36px] h-9 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center ${
                      pagination.page === pageNum
                        ? "bg-[#C19A6B] text-white"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-[#C19A6B]/40 hover:text-[#C19A6B]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`p-2 rounded-lg border ${
                pagination.page === pagination.totalPages
                  ? "bg-white text-gray-300 border-gray-100 cursor-not-allowed"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#C19A6B]/40 hover:text-[#C19A6B]"
              } transition-colors duration-200`}
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}

        {/* Mobile Help Section */}
        <div className="md:hidden mt-8">
          <div className="border border-[#C19A6B]/20 rounded-lg p-5 text-center">
            <h3 className="font-medium text-gray-900 text-sm mb-1">Need Help?</h3>
            <p className="text-xs text-gray-400 mb-4">
              Having issues with your order? We're here to help!
            </p>
            <button
              onClick={handleCallSupport}
              className="flex items-center justify-center gap-2 w-full bg-[#C19A6B] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#A9854F] transition-colors"
            >
              <FaPhone className="text-xs" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
