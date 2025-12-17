import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaTruck, FaCheckCircle, FaCreditCard, 
  FaDownload, FaRedo, FaStar, FaHome, FaPhone, FaEnvelope 
} from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  
  // Get order data from navigation state or from localStorage/API
  const [order, setOrder] = useState(location.state?.order || null);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If no order in state, fetch from localStorage or API
    if (!order) {
      // This is a fallback - you should implement proper data fetching
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find(o => o.id === parseInt(orderId));
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [orderId, order]);

  // Mock data in case order is not found
  const mockOrders = [
    {
      id: 1,
      orderNo: 'ORD-2023-001',
      date: '2023-12-15',
      amount: '₹25,499',
      status: 'delivered',
      items: [
        { name: 'Diamond Pendant Set', quantity: 1, price: '₹18,999', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150' },
        { name: 'Gold Earrings', quantity: 1, price: '₹6,500', image: 'https://images.unsplash.com/photo-1605100940032-c0c1c4fdf445?w=150' }
      ],
      shippingAddress: '123, MG Road, Bangalore, Karnataka - 560001',
      paymentMethod: 'Credit Card',
      trackingId: 'TRK-789456123',
      estimatedDelivery: '2023-12-18'
    },
    // ... other orders
  ];

  const currentOrder = order || mockOrders.find(o => o.id === parseInt(orderId));

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/myOrders')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'shipped': return <FaTruck className="text-blue-500 text-xl" />;
      case 'processing': return <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
      case 'cancelled': return <div className="text-red-500 text-xl">✕</div>;
      default: return <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const handleReorder = () => {
    alert(`Reordering order #${currentOrder.orderNo}`);
  };

  const handleWriteReview = () => {
    alert(`Writing review for order #${currentOrder.orderNo}`);
  };

  const handleTrackOrder = () => {
    alert(`Tracking order #${currentOrder.orderNo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
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
                <p className="text-amber-100">Order #{currentOrder.orderNo} • {formatDate(currentOrder.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
              {getStatusIcon(currentOrder.status)}
              <div>
                <p className="font-semibold">Order {getStatusText(currentOrder.status)}</p>
                <p className="text-sm text-amber-100">{currentOrder.amount}</p>
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  {getStatusIcon(currentOrder.status)}
                  <div>
                    <h3 className="font-bold text-gray-900">Order {getStatusText(currentOrder.status)}</h3>
                    <p className="text-sm text-gray-600">
                      {currentOrder.status === 'delivered' 
                        ? `Delivered on ${formatDate(currentOrder.estimatedDelivery)}`
                        : currentOrder.status === 'shipped'
                        ? `Estimated delivery: ${formatDate(currentOrder.estimatedDelivery)}`
                        : 'Your order is being processed'}
                    </p>
                  </div>
                </div>
                {currentOrder.trackingId && (
                  <div className="bg-white px-4 py-2 rounded-lg border border-amber-200">
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-medium text-gray-900">{currentOrder.trackingId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors duration-200">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-lg mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                          Quantity: <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">{item.price}</div>
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Shipping Address */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FaHome className="text-gray-500" />
                    <h3 className="font-medium text-gray-900">Shipping Address</h3>
                  </div>
                  <p className="text-gray-700">{currentOrder.shippingAddress}</p>
                </div>

                {/* Payment Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCreditCard className="text-gray-500" />
                    <h3 className="font-medium text-gray-900">Payment Information</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">{currentOrder.paymentMethod}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{currentOrder.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (GST)</span>
                      <span className="text-gray-900">Included</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span>{currentOrder.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {currentOrder.status === 'delivered' && (
                  <>
                    <button
                      onClick={handleReorder}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300"
                    >
                      <FaRedo />
                      Reorder
                    </button>
                    <button
                      onClick={handleWriteReview}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-300"
                    >
                      <FaStar />
                      Write Review
                    </button>
                  </>
                )}
                
                {currentOrder.status === 'shipped' && (
                  <button
                    onClick={handleTrackOrder}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-300"
                  >
                    <FaTruck />
                    Track Order
                  </button>
                )}
                
                {/* PDF Download Button */}
                <PDFDownloadLink
                  document={<InvoicePDF order={currentOrder} />}
                  fileName={`invoice-${currentOrder.orderNo}.pdf`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
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
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm p-6 border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-4">Need Help with this Order?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-100">
                  <FaPhone className="text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-100">
                  <FaEnvelope className="text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@feauag.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;