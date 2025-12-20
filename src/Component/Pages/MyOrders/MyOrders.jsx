import React, { useState, useEffect } from 'react';
import { 
  FaHistory, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, 
  FaEye, FaDownload, FaRedo, FaStar, FaFilter, FaSearch, 
  FaCalendarAlt, FaRupeeSign, FaBoxOpen, FaCreditCard, 
  FaChevronRight, FaChevronDown, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const orders = [
    {
      id: 1,
      orderNo: 'ORD-2023-001',
      date: '2023-12-15',
      amount: '₹25,499',
      status: 'delivered',
      items: [
        { name: 'Diamond Pendant Set', quantity: 1, price: '₹18,999', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w-150' },
        { name: 'Gold Earrings', quantity: 1, price: '₹6,500', image: 'https://images.unsplash.com/photo-1605100940032-c0c1c4fdf445?w=150' }
      ],
      shippingAddress: '123, MG Road, Bangalore, Karnataka - 560001',
      paymentMethod: 'Credit Card',
      trackingId: 'TRK-789456123',
      estimatedDelivery: '2023-12-18'
    },
    {
      id: 2,
      orderNo: 'ORD-2023-002',
      date: '2023-12-10',
      amount: '₹18,999',
      status: 'shipped',
      items: [
        { name: 'Gold Bangle', quantity: 1, price: '₹18,999', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w-150' }
      ],
      shippingAddress: '456, Park Street, Kolkata, West Bengal - 700016',
      paymentMethod: 'UPI',
      trackingId: 'TRK-456123789',
      estimatedDelivery: '2023-12-13'
    },
    {
      id: 3,
      orderNo: 'ORD-2023-003',
      date: '2023-12-05',
      amount: '₹42,999',
      status: 'processing',
      items: [
        { name: 'Platinum Ring', quantity: 1, price: '₹32,999', image: 'https://images.unsplash.com/photo-1603561596112-0a1325447283?w=150' },
        { name: 'Pearl Necklace', quantity: 1, price: '₹10,000', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150' }
      ],
      shippingAddress: '789, Connaught Place, Delhi - 110001',
      paymentMethod: 'Credit Card',
      trackingId: 'TRK-123456789',
      estimatedDelivery: '2023-12-10'
    },
    {
      id: 4,
      orderNo: 'ORD-2023-004',
      date: '2023-11-28',
      amount: '₹15,750',
      status: 'cancelled',
      items: [
        { name: 'Silver Bracelet', quantity: 1, price: '₹15,750', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150' }
      ],
      shippingAddress: '321, Marine Drive, Mumbai, Maharashtra - 400020',
      paymentMethod: 'Debit Card',
      trackingId: null,
      estimatedDelivery: null
    },
    {
      id: 5,
      orderNo: 'ORD-2023-005',
      date: '2023-11-20',
      amount: '₹38,500',
      status: 'delivered',
      items: [
        { name: 'Diamond Earrings', quantity: 1, price: '₹28,500', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150' },
        { name: 'Gold Chain', quantity: 1, price: '₹10,000', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150' }
      ],
      shippingAddress: '123, MG Road, Bangalore, Karnataka - 560001',
      paymentMethod: 'EMI',
      trackingId: 'TRK-987654321',
      estimatedDelivery: '2023-11-25'
    },
    {
      id: 6,
      orderNo: 'ORD-2023-006',
      date: '2023-11-15',
      amount: '₹22,499',
      status: 'delivered',
      items: [
        { name: 'Ruby Pendant', quantity: 1, price: '₹22,499', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150' }
      ],
      shippingAddress: '123, MG Road, Bangalore, Karnataka - 560001',
      paymentMethod: 'Net Banking',
      trackingId: 'TRK-654987321',
      estimatedDelivery: '2023-11-20'
    }
  ];

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <FaHistory className="text-[#C19A6B]" /> },
    { label: 'Total Spent', value: '1,63,646', icon: <FaRupeeSign className="text-[#C19A6B]" /> },
    { label: 'Pending', value: orders.filter(o => o.status === 'processing').length, icon: <FaClock className="text-[#C19A6B]" /> },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: <FaCheckCircle className="text-[#C19A6B]" /> }
  ];

  const filters = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (order) => {
    navigate(`/orderDetails/${order.id}`, { state: { order } });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'shipped': return <FaTruck className="text-blue-500" />;
      case 'processing': return <FaClock className="text-yellow-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
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

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleReorder = (orderId) => {
    alert(`Reordering order #${orderId}`);
  };

  const handleTrackOrder = (orderId) => {
    alert(`Tracking order #${orderId}`);
  };

  const handleWriteReview = (orderId) => {
    alert(`Writing review for order #${orderId}`);
  };

  const handleCallSupport = () => {
    alert('Calling customer support...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C19A6B] to-[#D4B896] text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-amber-50/90 text-sm md:text-base">Track and manage all your jewelry purchases</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
              <FaBoxOpen className="text-xl md:text-2xl text-white" />
              <div>
                <p className="font-semibold text-sm md:text-base">{orders.length} Orders</p>
                <p className="text-xs md:text-sm text-amber-50/90">Lifetime purchases</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Mobile Stats Cards - Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto pb-4 mb-6 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm p-4 min-w-[150px] border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Stats Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-[#C19A6B]/20"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-gray-100">
          {/* Mobile Search Bar */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number or product name..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#C19A6B]" />
              <span className="text-gray-700 font-medium">Filter by:</span>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-[#C19A6B]" />
                <span className="font-medium text-gray-700">Filters</span>
              </div>
              <FaChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2 animate-slideDown">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => {
                      setActiveFilter(filter.key);
                      setShowFilters(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm ${
                      activeFilter === filter.key
                        ? 'bg-[#C19A6B] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-[#C19A6B] text-white hover:bg-[#B08D5F]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <FaBoxOpen className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 text-sm">No orders match your current filters or search.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div 
                  className="p-4 border-b border-gray-100 cursor-pointer"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{order.orderNo}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{order.amount}</div>
                      <div className="text-xs text-gray-600">{order.paymentMethod}</div>
                    </div>
                  </div>
                  
                  {/* First Item Preview */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.items[0].name}</p>
                      <p className="text-xs text-gray-600">Qty: {order.items[0].quantity}</p>
                      {order.items.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">+ {order.items.length - 1} more item(s)</p>
                      )}
                    </div>
                    <FaChevronRight className={`transform transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="p-4 border-t border-gray-100 animate-slideDown">
                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity} • {item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-gray-400 text-sm mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600">Shipping Address</p>
                          <p className="text-sm text-gray-900">{order.shippingAddress}</p>
                        </div>
                      </div>
                      
                      {order.trackingId && (
                        <div className="flex items-center gap-2">
                          <FaTruck className="text-gray-400 text-sm" />
                          <div>
                            <p className="text-xs text-gray-600">Tracking ID</p>
                            <p className="text-sm text-gray-900">{order.trackingId}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-[#C19A6B] text-white rounded-lg font-medium"
                      >
                        <FaEye className="text-xs" />
                        View Details
                      </button>
                      
                      {order.status === 'delivered' && (
                        <>
                          <button
                            onClick={() => handleReorder(order.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-100"
                          >
                            <FaRedo className="text-xs" />
                            Reorder
                          </button>
                          <button
                            onClick={() => handleWriteReview(order.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-purple-50 text-purple-600 rounded-lg font-medium border border-purple-100"
                          >
                            <FaStar className="text-xs" />
                            Review
                          </button>
                        </>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-green-50 text-green-600 rounded-lg font-medium border border-green-100 col-span-2"
                        >
                          <FaTruck className="text-xs" />
                          Track Order
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
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <FaBoxOpen className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">No orders match your current filters or search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Order Details</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={order.items[0].image} 
                                alt={order.items[0].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{order.orderNo}</div>
                            <div className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                            <div className="text-xs text-gray-500 mt-1">{order.items[0].name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400 text-sm" />
                          {formatDate(order.date)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{order.amount}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <FaCreditCard className="text-gray-400" />
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        {order.trackingId && (
                          <div className="text-xs text-gray-500 mt-1">Track ID: {order.trackingId}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-2 px-3 py-1 text-sm text-[#C19A6B] hover:text-[#B08D5F] hover:bg-[#C19A6B]/10 rounded transition-colors duration-200 font-medium"
                          >
                            <FaEye className="text-xs" />
                            View Details
                          </button>
                          
                          {order.status === 'delivered' && (
                            <>
                              <button
                                onClick={() => handleReorder(order.id)}
                                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                              >
                                <FaRedo className="text-xs" />
                                Reorder
                              </button>
                              <button
                                onClick={() => handleWriteReview(order.id)}
                                className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors duration-200"
                              >
                                <FaStar className="text-xs" />
                                Write Review
                              </button>
                            </>
                          )}
                          
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleTrackOrder(order.id)}
                              className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors duration-200"
                            >
                              <FaTruck className="text-xs" />
                              Track Order
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

        {/* Mobile Help Section */}
        <div className="md:hidden mt-8">
          <div className="bg-gradient-to-r from-[#C19A6B] to-[#D4B896] text-white rounded-xl p-4">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-white/90 mb-3">Having issues with your order? We're here to help!</p>
            <button
              onClick={handleCallSupport}
              className="flex items-center justify-center gap-2 w-full bg-white text-[#C19A6B] py-2.5 rounded-lg font-medium"
            >
              <FaPhone />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;