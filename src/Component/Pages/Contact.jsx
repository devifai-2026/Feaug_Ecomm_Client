import React, { useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { RxDividerVertical } from 'react-icons/rx';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            offset: 100,
        });
    }, []);

    return (
      <div className="overflow-x-hidden">
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
                        <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>
                            Whether you have questions about our jewelry collections, need assistance with an order, or simply want to share your thoughts, please don't hesitate to reach out to us.
                        </p>
                    </div>
                    
                    {/* right side form */}
                    <div className='flex-1 w-full' data-aos="fade-left" data-aos-delay="200">
                        <div className='bg-white p-6 sm:p-8 shadow-lg w-full'>
                            <form className='space-y-6 sm:space-y-8 w-full'>
                                <div className='space-y-2 w-full'>
                                    <label className='block text-gray-600 text-sm sm:text-base'>Name</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent text-sm sm:text-base'
                                        data-aos="fade-up"
                                        data-aos-delay="300"
                                    />
                                </div>
                                
                                <div className='space-y-2 w-full'>
                                    <label className='block text-gray-600 text-sm sm:text-base'>Email Address</label>
                                    <input 
                                        type="email" 
                                        className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent text-sm sm:text-base'
                                        data-aos="fade-up"
                                        data-aos-delay="400"
                                    />
                                </div>
                                
                                <div className='space-y-2 w-full'>
                                    <label className='block text-gray-600 text-sm sm:text-base'>Message</label>
                                    <textarea 
                                        rows="3"
                                        className='w-full px-2 py-3 border-b border-black focus:border-[#C19A6B] focus:outline-none transition-colors duration-300 bg-transparent resize-none text-sm sm:text-base'
                                        data-aos="fade-up"
                                        data-aos-delay="500"
                                    ></textarea>
                                </div>
                                
                                <button 
                                    type="submit"
                                    className='w-full bg-black text-white py-3 sm:py-4 px-6 font-semibold uppercase tracking-wider hover:bg-[#b08a5f] transition-colors duration-300 text-sm sm:text-base'
                                    data-aos="zoom-in"
                                    data-aos-delay="600"
                                >
                                    SUBMIT
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Information */}
        <div className='mt-12 md:mt-16 max-w-[90%] mx-auto'>
            <h2 className='text-center text-2xl sm:text-3xl md:text-4xl' data-aos="fade-up">Contact Information</h2>
            <div className='flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-12 mt-8 md:mt-12'>
                {/* first  */}
              <div className='flex gap-3 flex-1 w-full' data-aos="fade-right" data-aos-delay="200">
                 <RxDividerVertical className="text-xl lg:text-3xl text-[#C19A6B] font-bold mt-1 flex-shrink-0" />
                <div className='space-y-3 md:space-y-4 w-full'>
                     <h2 className='text-lg sm:text-xl font-semibold'>Customer Support</h2>
                 <p className='text-sm sm:text-base leading-relaxed'>If you have any questions, concerns, or need assistance with your order, our customer support team is here to help.</p>
                 <p className='text-sm sm:text-base leading-relaxed'>You can reach us via email at <span className='font-bold'>support@axelsjewelry.com</span> or by phone at <span className='font-bold'>1-800-123-4567</span>. Our team is available during our regular business hours, Monday through Friday from 9:00 AM to 6:00 PM (EST).</p>
                </div>
              </div>
              {/* second */}
              <div className='flex gap-3 flex-1 mt-6 lg:mt-0 w-full' data-aos="fade-left" data-aos-delay="300">
                 <RxDividerVertical className="text-xl lg:text-3xl text-[#C19A6B] font-bold mt-1 flex-shrink-0" />
                <div className='space-y-3 md:space-y-4 w-full'>
                     <h2 className='text-lg sm:text-xl font-semibold'>Visit Our Showroom</h2>
                 <p className='text-sm sm:text-base leading-relaxed'>Experience our exquisite jewelry collections in person at our flagship showroom.</p>
                 <p className='text-sm sm:text-base leading-relaxed'>Visit us at <span className='font-bold'>123 Luxury Avenue, Jewelry District, NY 10001</span>. Our showroom is open Monday through Saturday from 10:00 AM to 8:00 PM.</p>
                </div>
              </div>
            </div>
        </div>

        {/* Social Media Section */}
        <div className='max-w-[90%] mx-auto'>
            <div className='mt-12 md:mt-16 mb-12 md:mb-16'>
                <hr />
            </div>

            <div className='text-center mx-auto space-y-6 md:space-y-7 px-4' data-aos="zoom-in">
                 <h2 className='text-3xl sm:text-4xl md:text-5xl leading-tight'>Let's Get in Touch!</h2>
                 <div className='flex items-center gap-4 sm:gap-5 text-[#C19A6B] justify-center mx-auto flex-wrap'>
                    <FaInstagram className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer hover:scale-110 transition-transform duration-300' data-aos="fade-up" data-aos-delay="100" />
                    <FaXTwitter className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer hover:scale-110 transition-transform duration-300' data-aos="fade-up" data-aos-delay="200" />
                    <FaFacebook className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer hover:scale-110 transition-transform duration-300' data-aos="fade-up" data-aos-delay="300" />
                    <FaLinkedin className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer hover:scale-110 transition-transform duration-300' data-aos="fade-up" data-aos-delay="400" />
                    <FaYoutube className='h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer hover:scale-110 transition-transform duration-300' data-aos="fade-up" data-aos-delay="500" />
                 </div>
            </div>

            <div className='mt-12 md:mt-16 mb-12 md:mb-16'>
                <hr />
            </div>
        </div>
      </div>
    );
};

export default Contact;