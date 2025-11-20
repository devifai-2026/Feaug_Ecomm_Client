import React, { useState } from 'react';
import img from "../../assets/QuestionsUpdate/freepik__wearing-jewelry-chunky-silver-bracelet-with-hammer__7512.png"
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiPlus, FiMinus } from 'react-icons/fi';

const QuestionsUpdate = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        {
            question: "Are your products certified and of high quality?",
            answer: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks. We also provide certificates of authenticity for our diamond and gemstone jewelry."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and installment payment options through our financing partners."
        },
        {
            question: "Do you offer customization options for jewelry?",
            answer: "Yes, we offer comprehensive customization services. You can customize ring settings, engrave special messages, choose different gemstones, and work with our designers to create unique pieces that match your style and preferences."
        }
    ];

    return (
        <div className='max-w-[90%] mx-auto flex flex-col lg:flex-row items-stretch gap-10 mt-16'>
            {/* FAQ section */}
            <div 
                className='flex-1 bg-neutral-100 p-6 flex flex-col'
                data-aos="flip-left"
                data-aos-delay="200"
            >
                <h2 className='text-2xl font-bold mb-8'>Questions</h2>
                <div className='space-y-4 flex-1'>
                    {questions.map((item, index) => (
                        <div 
                            key={index} 
                            className={`bg-white transition-all duration-300 ${
                                openIndex === index 
                                    ? 'border-2 border-orange-900' 
                                    : ''
                            }`}
                            data-aos="fade-up"
                            data-aos-delay={index * 150 + 300}
                        >
                            {/* Question header with +/- icon */}
                            <div 
                                className='flex items-center justify-between p-4 cursor-pointer'
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            >
                                <div className='flex items-center gap-3'>
                                    <div className='w-6 h-10 flex items-center justify-center rounded'>
                                        {openIndex === index ? (
                                            <FiMinus className='text-orange-900 text-sm' />
                                        ) : (
                                            <FiPlus className='text-orange-900 text-sm' />
                                        )}
                                    </div>
                                    <span className='font-medium text-gray-800'>{item.question}</span>
                                </div>
                            </div>
                            
                            {/* Answer section */}
                            {openIndex === index && (
                                <div className='px-4 pb-4 ml-9'>
                                    <p className='text-gray-600'>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest Update Section */}
            <div 
                className='flex-1 bg-neutral-100 p-6 flex flex-col'
                data-aos="flip-right"
                data-aos-delay="300"
            >
                <h2 className='text-2xl font-bold mb-8'>Latest Updates</h2>
                <div className='flex-1 space-y-6'>
                 <div 
                    className='flex items-center gap-3'
                    data-aos="slide-up"
                    data-aos-delay="400"
                 >
                    <img className='h-40 w-40 object-cover' src={img} alt="" />
                    <div className='space-y-3'>
                        <p className='uppercase text-orange-900 text-sm font-medium'>TIPS</p>
                        <p className='text-base uppercase font-semibold'>How to choose the perfect <br /> Engagement ring for <br /> Beloved one</p>
                        <div className='space-y-1'>
                            <p className='text-gray-500'>Jane Thompson</p>
                            <p className='text-gray-500'>May 10, 2023</p>
                        </div>
                    </div>
                 </div>
                 <div 
                    className='flex items-center gap-3'
                    data-aos="slide-up"
                    data-aos-delay="500"
                 >
                    <img className='h-40 w-40 object-cover' src={img} alt="" />
                    <div className='space-y-3'>
                        <p className='uppercase text-orange-900 text-sm font-medium'>GUIDE</p>
                        <p className='text-base uppercase font-semibold'>Caring for your jewelry: <br /> Maintenance & Cleaning <br />Complete Guide</p>
                        <div className='space-y-1'>
                            <p className='text-gray-500'>Michael Davis</p>
                            <p className='text-gray-500'>February 5, 2023</p>
                        </div>
                    </div>
                 </div>
                 <p 
                    className='flex items-center gap-2 mt-6 text-gray-700 font-medium cursor-pointer hover:text-orange-900 transition-colors'
                    data-aos="fade-in"
                    data-aos-delay="600"
                 >
                    View All Articles
                    <FaArrowRightLong className='text-orange-900'/>
                 </p>
                </div>
            </div>
        </div>
    );
};

export default QuestionsUpdate;