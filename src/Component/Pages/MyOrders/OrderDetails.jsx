import React, { useState, useEffect } from 'react';
import {
  FaArrowLeft, FaTruck, FaCheckCircle, FaCreditCard,
  FaDownload, FaRedo, FaStar, FaHome, FaPhone, FaEnvelope,
  FaTimesCircle, FaClock
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import InvoicePDF from './InvoicePDF';
import orderApi from '../../../apis/orderApi';
import userApi from '../../../apis/user/userApi';

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
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    // Check if user is logged in
    if (!userApi.isAuthenticated()) {
      toast.error('Please login to view order details');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    orderApi.getOrder({
      orderId,
      setLoading,
      onSuccess: (data) => {
        if (data.success && data.data) {
          const orderData = data.data.order || data.data;

          const transformedOrder = {
            id: orderData._id || orderData.id,
            orderNo: orderData.orderId || `ORD-${(orderData._id || orderData.id).slice(-8).toUpperCase()}`,
            date: orderData.createdAt,
            subtotal: orderData.subtotal || 0,
            discount: orderData.discount || 0,
            shippingCharge: orderData.shippingCharge || 0,
            tax: orderData.tax || 0,
            amount: orderData.grandTotal || orderData.total || 0,
            status: orderData.status || 'pending',
            shippingStatus: orderData.shippingStatus,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod || 'Online',
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: orderData.razorpayPaymentId,
            items: (orderData.items || []).map(item => ({
              id: item.product?._id || item.productId,
              name: item.product?.name || item.name || 'Product',
              quantity: item.quantity || 1,
              price: item.price || 0,
              image: item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'
            })),
            shippingAddress: orderData.shippingAddress || {},
            billingAddress: orderData.billingAddress || {},
            trackingId: orderData.trackingNumber || null,
            estimatedDelivery: orderData.estimatedDelivery || null,
            deliveredAt: orderData.deliveredAt || null
          };

          setOrder(transformedOrder);
        } else {
          setError('Order not found');
        }
      },
      onError: (err) => {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      },
    });
  }, [orderId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'shipped': return <FaTruck className="text-blue-500 text-xl" />;
      case 'pending':
      case 'confirmed':
      case 'processing': return <FaClock className="text-yellow-500 text-xl" />;
      case 'cancelled':
      case 'returned':
      case 'refunded': return <FaTimesCircle className="text-red-500 text-xl" />;
      default: return <FaClock className="text-gray-500 text-xl" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      case 'refunded': return 'Refunded';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return price || '₹0';
  };

  const formatAddress = (address) => {
    if (!address || typeof address === 'string') return address || 'Address not available';
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ') || 'Address not available';
  };

  const handleReorder = () => {
    toast.info('Reorder feature coming soon!');
  };

  const handleWriteReview = () => {
    toast.info('Review feature coming soon!');
  };

  const handleTrackOrder = () => {
    orderApi.trackOrder({
      orderId: order.id,
      onSuccess: (data) => {
        if (data.success) {
          toast.success('Order tracking details loaded');
          // Could show a modal with tracking info
        }
      },
      onError: () => {
        toast.error('Failed to load tracking details');
      }
    });
  };

  const handleCancelOrder = () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    orderApi.cancelOrder({
      orderId: order.id,
      reason: 'Customer requested cancellation',
      onSuccess: (data) => {
        if (data.success) {
          toast.success('Order cancelled successfully');
          setOrder(prev => ({ ...prev, status: 'cancelled' }));
        }
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to cancel order');
      },
    });
    setCancelling(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-gradient-to-r from-[#C19A6B] to-[#D4B896] text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-10 bg-white/20 w-48 mb-2 rounded"></div>
              <div className="h-4 bg-white/20 w-64 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 w-32 mb-4 rounded"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
              <div className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 w-32 mb-4 rounded"></div>
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 w-32 mb-4 rounded"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Order Not Found'}</h2>
          <button
            onClick={() => navigate('/myOrders')}
            className="px-6 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#B08D5F] transition-colors duration-300 font-medium"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C19A6B] to-[#D4B896] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/myOrders')}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Details</h1>
                <p className="text-white/90">Order #{order.orderNo} • {formatDate(order.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
              {getStatusIcon(order.status)}
              <div>
                <p className="font-semibold">Order {getStatusText(order.status)}</p>
                <p className="text-sm text-white/90">{formatPrice(order.amount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#C19A6B]/10 to-[#D4B896]/10 rounded-lg border border-[#C19A6B]/20">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-bold text-gray-900">Order {getStatusText(order.status)}</h3>
                    <p className="text-sm text-gray-600">
                      {order.status === 'delivered'
                        ? `Delivered on ${formatDate(order.deliveredAt || order.estimatedDelivery)}`
                        : order.status === 'shipped'
                          ? `Estimated delivery: ${formatDate(order.estimatedDelivery)}`
                          : ['cancelled', 'returned', 'refunded'].includes(order.status)
                            ? `Order was ${order.status}`
                            : 'Your order is being processed'}
                    </p>
                  </div>
                </div>
                {order.trackingId && (
                  <div className="bg-white px-4 py-2 rounded-lg border border-[#C19A6B]/20">
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-medium text-gray-900">{order.trackingId}</p>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              {order.paymentStatus && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#C19A6B]/40 transition-colors duration-200">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-lg mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                          Quantity: <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Shipping Address */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#C19A6B]/40 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaHome className="text-[#C19A6B]" />
                    <h3 className="font-medium text-gray-900">Shipping Address</h3>
                  </div>
                  <p className="text-gray-700">{formatAddress(order.shippingAddress)}</p>
                  {order.shippingAddress?.phone && (
                    <p className="text-sm text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>

                {/* Payment Information */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#C19A6B]/40 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCreditCard className="text-[#C19A6B]" />
                    <h3 className="font-medium text-gray-900">Payment Information</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                  </div>
                  {order.razorpayPaymentId && (
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-medium text-gray-900">{order.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#C19A6B]/40 transition-colors duration-200">
                  <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(order.subtotal || order.amount)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={order.shippingCharge === 0 ? 'text-green-600' : 'text-gray-900'}>
                        {order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}
                      </span>
                    </div>
                    {order.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (GST)</span>
                        <span className="text-gray-900">{formatPrice(order.tax)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-[#C19A6B]">{formatPrice(order.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {order.status === 'delivered' && (
                  <>
                    <button
                      onClick={handleReorder}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#B08D5F] transition-colors duration-300 font-medium"
                    >
                      <FaRedo />
                      Reorder
                    </button>
                    <button
                      onClick={handleWriteReview}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-300 font-medium"
                    >
                      <FaStar />
                      Write Review
                    </button>
                  </>
                )}

                {order.status === 'shipped' && (
                  <button
                    onClick={handleTrackOrder}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-300 font-medium"
                  >
                    <FaTruck />
                    Track Order
                  </button>
                )}

                {['pending', 'confirmed', 'processing'].includes(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 font-medium disabled:opacity-50"
                  >
                    <FaTimesCircle />
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}

                {/* PDF Download Button */}
                <PDFDownloadLink
                  document={<InvoicePDF order={order} />}
                  fileName={`invoice-${order.orderNo}.pdf`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  {({ loading }) => (
                    <>
                      <FaDownload />
                      {loading ? 'Generating Invoice...' : 'Download Invoice'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-gradient-to-br from-[#C19A6B]/10 to-white rounded-xl shadow-sm p-6 border border-[#C19A6B]/20">
              <h3 className="font-bold text-gray-900 mb-4">Need Help with this Order?</h3>
              <div className="space-y-3">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#C19A6B]/20 hover:border-[#C19A6B]/40 transition-colors duration-200"
                >
                  <FaPhone className="text-[#C19A6B]" />
                  <div>
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-gray-600">+91 98765 43210</p>
                  </div>
                </a>
                <a
                  href="mailto:support@feauag.com"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#C19A6B]/20 hover:border-[#C19A6B]/40 transition-colors duration-200"
                >
                  <FaEnvelope className="text-[#C19A6B]" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@feauag.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
