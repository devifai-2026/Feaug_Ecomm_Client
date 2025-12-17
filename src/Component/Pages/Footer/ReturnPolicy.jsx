import React, { useEffect } from 'react';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaShippingFast, FaExchangeAlt, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const ReturnPolicy = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const returnConditions = [
    {
      icon: <FaCheckCircle className="text-green-500" />,
      title: "Eligible for Return",
      items: [
        "Defective or damaged products",
        "Wrong item received",
        "Size/fit issues (with tags intact)",
        "Quality issues reported within 48 hours"
      ]
    },
    {
      icon: <FaTimesCircle className="text-red-500" />,
      title: "Not Eligible for Return",
      items: [
        "Products without original tags/labels",
        "Personalized/customized items",
        "Products damaged due to misuse",
        "Items returned after 30 days",
        "Underwear, innerwear, and socks"
      ]
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Log into your account, go to 'My Orders' and select the item to return",
      icon: "📱"
    },
    {
      step: 2,
      title: "Pickup Scheduled",
      description: "Schedule a pickup from your address within 24 hours",
      icon: "🚚"
    },
    {
      step: 3,
      title: "Quality Check",
      description: "Our team verifies the product condition at warehouse",
      icon: "✅"
    },
    {
      step: 4,
      title: "Refund Processed",
      description: "Refund issued within 5-7 business days after approval",
      icon: "💳"
    }
  ];

  const refundMethods = [
    {
      method: "Original Payment Method",
      time: "5-7 business days",
      icon: <FaMoneyBillWave className="text-green-600" />
    },
    {
      method: "Store Credit",
      time: "Instant (with 10% extra bonus)",
      icon: <FaExchangeAlt className="text-blue-600" />
    },
    {
      method: "Bank Transfer",
      time: "3-5 business days",
      icon: <FaShieldAlt className="text-purple-600" />
    }
  ];

  const categories = [
    {
      name: "Clothing & Apparel",
      returnWindow: "30 days",
      condition: "Unworn, unwashed with tags"
    },
    {
      name: "Footwear",
      returnWindow: "30 days",
      condition: "Unworn, in original box"
    },
    {
      name: "Electronics",
      returnWindow: "15 days",
      condition: "Original packaging, no physical damage"
    },
    {
      name: "Home & Living",
      returnWindow: "30 days",
      condition: "Unused in original packaging"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Return & Refund Policy
            </h1>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-amber-800 font-medium">
              Last Updated: December 1, 2023 • Easy 30-Day Return Policy
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Return Conditions */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaShippingFast className="text-amber-600" />
                Return Eligibility
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {returnConditions.map((condition, index) => (
                  <div key={index} className={`border rounded-lg p-5 ${index === 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      {condition.icon}
                      <h3 className="text-lg font-semibold text-gray-900">{condition.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {condition.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Return Process */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4-Step Return Process</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {returnProcess.map((process, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-5 h-full">
                      <div className="text-3xl mb-3">{process.icon}</div>
                      <div className="absolute top-4 right-4 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {process.step}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{process.title}</h3>
                      <p className="text-sm text-gray-600">{process.description}</p>
                    </div>
                    {index < returnProcess.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Policy Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Return Window</span>
                  <span className="font-semibold text-gray-900">30 Days</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Return Pickup</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Refund Time</span>
                  <span className="font-semibold text-gray-900">5-7 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exchange</span>
                  <span className="font-semibold text-gray-900">Available</span>
                </div>
              </div>
            </div>

           
            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Important Notes</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep the original packaging until return is complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Return pickup available in 15,000+ pin codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>International orders have separate return policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Contact support for damaged-in-transit items</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => window.location.href = '/help-center'}
              className="w-full py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaShippingFast />
              Initiate Return Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Q: How long does it take to process my refund?</h4>
              <p className="text-gray-700">Once we receive and inspect your return, refunds are processed within 5-7 business days. You'll receive a confirmation email once completed.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Q: Can I exchange an item instead of returning?</h4>
              <p className="text-gray-700">Yes, exchanges are available for size/color changes. Select 'Exchange' instead of 'Return' during the initiation process.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Q: What if I received a damaged/wrong product?</h4>
              <p className="text-gray-700">Contact our support team within 48 hours of delivery with photos of the product and packaging. We'll arrange an immediate replacement.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions about our return policy?
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-600 text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors"
          >
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;