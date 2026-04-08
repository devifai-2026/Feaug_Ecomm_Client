import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import contactSupportApi from '../../../apis/contactSupportApi';

const HelpCenter = () => {
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
      icon: <FaPhoneAlt />,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Available 9AM - 8PM, Mon-Sat'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      details: 'support@feauag.com',
      description: 'Response within 24 hours'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Store',
      details: 'Find a Store',
      description: '50+ stores across India'
    },
    {
      icon: <FaClock />,
      title: 'Business Hours',
      details: '9AM - 8PM',
      description: 'Monday to Saturday'
    }
  ];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    contactSupportApi.submitContactForm({
      data: formData,
      setLoading: setSubmitting,
      onSuccess: () => {
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      },
      onError: (err) => {
        toast.error(err?.data?.message || 'Failed to send message. Please try again.');
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const quickTips = [
    'Include your order number for faster assistance',
    'Check our FAQ page for common questions',
    'Provide detailed description of your issue',
    'Response time: 24 hours for email, immediate for phone'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-3">
            Help & Support
          </h1>
          <div className="w-16 h-[2px] bg-[#C19A6B] mx-auto mb-4"></div>
          <p className="text-gray-500 text-base tracking-wide">
            We're here to help you with any questions or concerns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-8 tracking-wide">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-lg hover:border-[#C19A6B]/30 transition-colors duration-200"
                >
                  <div className="text-[#C19A6B] text-lg mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm tracking-wide uppercase mb-1">{item.title}</h3>
                    <p className="text-gray-800 text-sm font-medium">{item.details}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">Quick Tips</h3>
              <ul className="space-y-3">
                {quickTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <FaCheck className="text-[#C19A6B] text-xs mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-8 tracking-wide">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition-colors"
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
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition-colors resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#C19A6B] text-white text-sm font-medium tracking-wider uppercase rounded-lg hover:bg-[#A9854F] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
