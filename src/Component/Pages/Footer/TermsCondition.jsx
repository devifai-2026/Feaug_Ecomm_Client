import React, { useEffect } from 'react';
import { FaGem, FaShieldAlt, FaFileContract, FaLock, FaUserShield, FaShoppingBag, FaCreditCard, FaTruck, FaExchangeAlt, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TermsCondition = () => {
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 1,
      title: "1. Acceptance of Terms",
      icon: <FaFileContract style={{ color: primaryColor }} />,
      content: "By accessing and using the FEAUG Jewellery website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services."
    },
    {
      id: 2,
      title: "2. Account Registration & Security",
      icon: <FaLock className="text-blue-600" />,
      content: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or remove content at our discretion.",
      subpoints: [
        "Provide accurate and complete information during registration",
        "Notify us immediately of any unauthorized account activity",
        "You may not use another person's account without permission"
      ]
    },
    {
      id: 3,
      title: "3. Product Information & Pricing",
      icon: <FaGem style={{ color: primaryColor }} />,
      content: "All jewellery products displayed are subject to availability. We make every effort to ensure accuracy in product descriptions, images, and pricing. However, we reserve the right to correct any errors and to update information at any time without prior notice.",
      subpoints: [
        "Product images are for representation and may vary slightly",
        "Gold prices fluctuate daily based on market rates",
        "Diamond weights are approximate (±0.05 carats)"
      ]
    },
    {
      id: 4,
      title: "4. Orders & Payment",
      icon: <FaCreditCard className="text-green-600" />,
      content: "All orders are subject to acceptance and availability. We accept various payment methods including credit/debit cards, net banking, UPI, and EMI options. Payment must be completed before order processing begins.",
      subpoints: [
        "Orders are confirmed only after payment verification",
        "We reserve the right to cancel orders for any reason",
        "Custom orders require 50% advance payment"
      ]
    },
    {
      id: 5,
      title: "5. Shipping & Delivery",
      icon: <FaTruck className="text-red-600" />,
      content: "We ship across India through trusted courier partners with insurance coverage. Delivery timelines are estimates and may vary. Risk of loss passes to you upon delivery to the carrier.",
      subpoints: [
        "Free shipping on orders above ₹10,000",
        "Same-day delivery available in select cities",
        "Signature required upon delivery",
        "International shipping available with additional charges"
      ]
    },
    {
      id: 6,
      title: "6. Returns, Exchanges & Refunds",
      icon: <FaExchangeAlt className="text-orange-600" />,
      content: "Please refer to our detailed Return Policy for comprehensive information. Returns must be initiated within 15 days of delivery for non-customized items.",
      subpoints: [
        "Customized/personalized items cannot be returned",
        "Products must be unused with original packaging",
        "Refunds processed within 7-10 business days",
        "Exchange subject to product availability"
      ]
    },
    {
      id: 7,
      title: "7. Certification & Quality Assurance",
      icon: <FaShieldAlt className="text-cyan-600" />,
      content: "All gold jewellery is BIS Hallmarked. Diamonds are certified by reputed laboratories. We provide certificates of authenticity with every purchase.",
      subpoints: [
        "24K gold purity certification provided",
        "Diamond certification includes 4Cs details",
        "Lifetime warranty on craftsmanship",
        "Free annual polishing for gold jewellery"
      ]
    },
    {
      id: 8,
      title: "8. Intellectual Property",
      icon: <FaUserShield className="text-indigo-600" />,
      content: "All content on this website, including designs, logos, images, and text, is the property of FEAUG Jewellery and protected by copyright laws. You may not reproduce, distribute, or use any content without written permission."
    },
    {
      id: 9,
      title: "9. Limitation of Liability",
      icon: <FaShoppingBag className="text-gray-600" />,
      content: "FEAUG Jewellery shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products."
    },
    {
      id: 10,
      title: "10. Governing Law & Jurisdiction",
      icon: <FaCalendarAlt style={{ color: primaryDark }} />,
      content: "These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FaGem style={{ color: primaryColor }} className="text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 text-lg">
              Last Updated: December 1, 2023
            </p>
          </div>
          
          <div 
            className="p-4 rounded-r-lg border-l-4"
            style={{ 
              backgroundColor: primaryLight + '20',
              borderColor: primaryColor
            }}
          >
            <p style={{ color: primaryDark }}>
              <strong>Important:</strong> Please read these Terms carefully before using our website or making a purchase. Your continued use constitutes acceptance of these terms.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FEAUAG Jewellery</h2>
              <p className="text-gray-700 mb-4">
                FEAUAG Jewellery ("we," "our," or "us") operates the website feauag.com (the "Site"). These Terms and Conditions govern your access to and use of our Site and services, including the purchase of our jewellery products.
              </p>
              <p className="text-gray-700">
                We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site following any changes constitutes acceptance of those changes.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: primaryLight + '30' }}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-gray-700 mb-4">{section.content}</p>
                      
                      {section.subpoints && (
                        <div className="ml-6 space-y-2">
                          {section.subpoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span style={{ color: primaryColor }} className="mt-1">•</span>
                              <span className="text-gray-700">{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Notice */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-3">Important Notice</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Gold prices change daily based on market rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Custom orders cannot be cancelled after production begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Keep all certificates safe for insurance claims</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Contact us within 24 hours for delivery issues</span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div 
              className="rounded-xl shadow-sm p-6 border"
              style={{ 
                background: 'linear-gradient(to bottom right, #FEF9F3, white)',
                borderColor: primaryLight
              }}
            >
              <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-700 text-sm mb-4">
                Have questions about our Terms & Conditions?
              </p>
              <Link to='/contact'>
                <button 
                  className="w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  <FaPhoneAlt />
                  Contact Support
                </button>
              </Link>
            </div>

            {/* Update Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaCalendarAlt className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Last Updated</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                These Terms were last updated on:
              </p>
              <p className="font-bold text-gray-900">December 1, 2023</p>
              <p className="text-gray-600 text-xs mt-2">
                Previous versions available upon request
              </p>
            </div>
          </div>
        </div>

        {/* Acknowledgement Section */}
        <div 
          className="mt-12 bg-white rounded-xl shadow-sm p-8 border"
          style={{ borderColor: primaryLight }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Acknowledgement</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-6">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, along with our Privacy Policy and other relevant policies.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-green-500" />
                  <span className="font-medium text-gray-900">Secure Transactions</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaGem style={{ color: primaryColor }} />
                  <span className="font-medium text-gray-900">Certified Quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUserShield className="text-blue-500" />
                  <span className="font-medium text-gray-900">Data Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p className="mb-2">
            FEAUAG Jewellery complies with all applicable laws and regulations in India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
            <span>© 2023 FEAUG Jewellery. All rights reserved.</span>
            <span>|</span>
            <span>Registered under The Companies Act, 2013</span>
            <span>|</span>
            <span>GSTIN: 27AAECF1234M1Z5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;