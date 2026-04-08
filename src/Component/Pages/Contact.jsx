import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import contactSupportApi from '../../apis/contactSupportApi';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Call backend API to send email
        contactSupportApi.submitContactForm({
            data: formData,
            setLoading,
            onSuccess: (response) => {
                toast.success('Message sent successfully! We\'ll get back to you soon.', {
                    duration: 5000,
                    icon: '✨',
                    style: { background: '#C19A6B', color: '#fff' },
                });
                setFormData({ name: '', email: '', message: '' });
            },
            onError: (error) => {
                console.error('Error sending message:', error);
                toast.error(`Error: ${error?.message || 'Failed to send message'}`);
            },
        });
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <section className="pt-24 pb-12 px-6 sm:px-8 lg:px-12 text-center">
                <p className="uppercase tracking-[0.35rem] text-[#C19A6B] text-xs font-light mb-6">
                    Contact Us
                </p>
                <div className="w-12 h-[1px] bg-[#C19A6B] mx-auto mb-10"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-gray-900">
                    Get in Touch
                </h1>
                <p className="mt-6 text-gray-500 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
                    We value your feedback, inquiries, and any assistance you may need. Our dedicated team is ready to help.
                </p>
            </section>

            {/* Main Content - Split Layout */}
            <section className="pb-24 md:pb-32 px-6 sm:px-8 lg:px-12">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left Side - Contact Info */}
                    <div className="lg:w-2/5 space-y-12 pt-4">
                        <div>
                            <p className="uppercase tracking-[0.25rem] text-[#C19A6B] text-xs font-light mb-4">
                                Visit Us
                            </p>
                            <div className="flex items-start gap-4">
                                <svg className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-gray-700 text-sm font-light leading-relaxed">
                                        123 Luxury Avenue<br />
                                        New Delhi, India 110001
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="uppercase tracking-[0.25rem] text-[#C19A6B] text-xs font-light mb-4">
                                Email Us
                            </p>
                            <div className="flex items-start gap-4">
                                <svg className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-700 text-sm font-light">
                                    contact@axelsjewelry.com
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="uppercase tracking-[0.25rem] text-[#C19A6B] text-xs font-light mb-4">
                                Call Us
                            </p>
                            <div className="flex items-start gap-4">
                                <svg className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <p className="text-gray-700 text-sm font-light">
                                    +91 98765 43210
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-12 h-[1px] bg-stone-200"></div>

                        {/* Social Links */}
                        <div>
                            <p className="uppercase tracking-[0.25rem] text-[#C19A6B] text-xs font-light mb-6">
                                Follow Us
                            </p>
                            <div className="flex items-center gap-5">
                                <a href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors duration-300">
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors duration-300">
                                    <FaFacebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors duration-300">
                                    <FaXTwitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors duration-300">
                                    <FaLinkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors duration-300">
                                    <FaYoutube className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:w-3/5">
                        <div className="bg-white border border-stone-200 p-8 sm:p-10 md:p-12">
                            <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
                                Send a Message
                            </h3>
                            <p className="text-gray-400 text-sm font-light mb-10">
                                We'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-7">
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15rem] text-gray-500 font-light mb-3">
                                        Full Name <span className="text-[#C19A6B]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-stone-200 bg-white text-sm font-light text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15rem] text-gray-500 font-light mb-3">
                                        Email Address <span className="text-[#C19A6B]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-stone-200 bg-white text-sm font-light text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-[0.15rem] text-gray-500 font-light mb-3">
                                        Message <span className="text-[#C19A6B]">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="How can we help you?"
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-stone-200 bg-white text-sm font-light text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C19A6B] transition-colors duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#C19A6B] text-white py-4 uppercase tracking-[0.2rem] text-xs font-light hover:bg-[#a8845a] transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
