import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { RxDividerVertical } from 'react-icons/rx';
import toast, { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            offset: 100,
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate form data
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // IMPORTANT: Replace with your NEW API key from Brevo (API Keys section, not SMTP)
        const apiKey = import.meta.env.VITE_BREVO_API_KEY;
        
        // IMPORTANT: Replace these with your actual emails
        const verifiedSenderEmail = "bikrambiswas912@gmail.com"; // Must be verified in Brevo
        const yourEmail = "bikrambiswas912@gmail.com"; // Where you want to receive emails
        
        // Email data
        const emailData = {
            sender: {
                name: "Axels Jewelry Contact Form",
                email: verifiedSenderEmail
            },
            to: [{
                email: yourEmail,
                name: "Axels Jewelry Admin"
            }],
            replyTo: {
                email: formData.email,
                name: formData.name
            },
            subject: `New Contact Form Message from ${formData.name}`,
            htmlContent: `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                            <div style="background: #C19A6B; padding: 30px 20px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 28px;">AXELS JEWELRY</h1>
                                <p style="color: white; margin: 10px 0 0;">New Contact Form Submission</p>
                            </div>
                            <div style="padding: 40px 30px;">
                                <div style="margin-bottom: 30px;">
                                    <h3 style="color: #C19A6B; border-bottom: 2px solid #C19A6B; padding-bottom: 10px;">Sender Information</h3>
                                    <p><strong>Name:</strong> ${formData.name}</p>
                                    <p><strong>Email:</strong> ${formData.email}</p>
                                </div>
                                <div>
                                    <h3 style="color: #C19A6B; border-bottom: 2px solid #C19A6B; padding-bottom: 10px;">Message</h3>
                                    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
                                        ${formData.message.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        try {
            console.log('Sending email with data:', { 
                sender: emailData.sender.email,
                to: emailData.to[0].email,
                apiKeyLength: apiKey.length 
            });

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey.trim(), // Remove any accidental whitespace
                    'content-type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Email sent successfully:', data);
                toast.success('Message sent successfully! We\'ll get back to you soon.', {
                    duration: 5000,
                    icon: '✨',
                    style: { background: '#C19A6B', color: '#fff' },
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                console.error('Brevo API error:', data);
                
                // More specific error messages
                if (data.code === 'unauthorized') {
                    toast.error('API key error. Please check your Brevo API key.');
                    console.error('Make sure you are using an API key (from API Keys section), not an SMTP key');
                } else if (data.message && data.message.includes('sender')) {
                    toast.error('Sender email not verified. Please verify your email in Brevo.');
                } else {
                    toast.error(`Error: ${data.message || 'Failed to send email'}`);
                }
            }
            
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Failed to send message. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-x-hidden">
            <Toaster position="top-right" />
            
            <div className='bg-[#ede3d759] mt-12'>
                <div className='max-w-[90%] mx-auto py-12 md:py-16'>
                    <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-center'>
                        {/* left side */}
                        <div className='flex-1 space-y-4 md:space-y-6 w-full' data-aos="fade-right">
                            <h2 className="uppercase tracking-[0.3rem] text-[#C19A6B] text-sm md:text-base">CONTACT US</h2>
                            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight'>Get in Touch</h2>
                            <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>
                                At Axels, we value your feedback, inquiries, and any assistance you may need. Our dedicated team is ready to provide you with the support you require.
                            </p>
                        </div>
                        
                        {/* right side form */}
                        <div className='flex-1 w-full' data-aos="fade-left" data-aos-delay="200">
                            <div className='bg-white p-6 sm:p-8 shadow-lg w-full'>
                                <form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8 w-full'>
                                    <div className='space-y-2 w-full'>
                                        <label className='block text-gray-600 text-sm sm:text-base'>Name *</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent text-sm sm:text-base placeholder-gray-400'
                                            data-aos="fade-up"
                                            data-aos-delay="300"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div className='space-y-2 w-full'>
                                        <label className='block text-gray-600 text-sm sm:text-base'>Email Address *</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent text-sm sm:text-base placeholder-gray-400'
                                            data-aos="fade-up"
                                            data-aos-delay="400"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div className='space-y-2 w-full'>
                                        <label className='block text-gray-600 text-sm sm:text-base'>Message *</label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            placeholder="How can we help you?"
                                            className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent resize-none text-sm sm:text-base placeholder-gray-400'
                                            data-aos="fade-up"
                                            data-aos-delay="500"
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className='w-full bg-black text-white py-3 sm:py-4 px-6 font-semibold uppercase tracking-wider hover:bg-[#b08a5f] transition-colors duration-300 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed'
                                    >
                                        {loading ? 'SENDING...' : 'SUBMIT'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;