import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const HelpCenter = () => {
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: <FaPhoneAlt style={{ color: primaryColor }} />,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Available 9AM - 8PM, Mon-Sat'
    },
    {
      icon: <FaEnvelope style={{ color: primaryColor }} />,
      title: 'Email Us',
      details: 'support@feauag.com',
      description: 'Response within 24 hours'
    },
    {
      icon: <FaMapMarkerAlt style={{ color: primaryColor }} />,
      title: 'Visit Store',
      details: 'Find a Store',
      description: '50+ stores across India'
    },
    {
      icon: <FaClock style={{ color: primaryColor }} />,
      title: 'Business Hours',
      details: '9AM - 8PM',
      description: 'Monday to Saturday'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Optionally scroll to top after form submission
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Help & Support
          </h1>
          <p className="text-gray-600 text-lg">
            We're here to help you with any questions or concerns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: primaryLight }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-900 font-medium">{item.details}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="mt-8 p-6 rounded-lg border"
              style={{ 
                backgroundColor: primaryLight + '20',
                borderColor: primaryLight
              }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Quick Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Include your order number for faster assistance</li>
                <li>• Check our FAQ page for common questions</li>
                <li>• Attach photos for product-related issues</li>
                <li>• Response time: 24 hours for email, immediate for phone</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ 
                    focusRingColor: primaryColor,
                    '&:focus': {
                      ringColor: primaryColor,
                      borderColor: 'transparent'
                    }
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    '&:focus': {
                      '--tw-ring-color': primaryColor
                    }
                  }}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    '&:focus': {
                      '--tw-ring-color': primaryColor
                    }
                  }}
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="product">Product Questions</option>
                  <option value="account">Account Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ 
                    '&:focus': {
                      '--tw-ring-color': primaryColor
                    }
                  }}
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-medium rounded-lg hover:opacity-90 transition-all"
                style={{ 
                  backgroundColor: primaryColor,
                  color: 'white'
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;