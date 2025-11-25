import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
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
        <div className='max-w-[90%] mx-auto mt-16'>
            {/* FAQ section */}
            <div className='bg-neutral-100 p-6'>
                <h2 className='text-2xl font-bold mb-8 text-center'>FAQ</h2>
                <div className='space-y-4'>
                    {questions.map((item, index) => (
                        <div 
                            key={index} 
                            className={`bg-white transition-all duration-300 overflow-hidden ${
                                openIndex === index 
                                    ? 'border-2 border-orange-900' 
                                    : ''
                            }`}
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
                            
                            {/* Answer section with smooth animation */}
                            <div 
                                className={`transition-all duration-300 ease-in-out ${
                                    openIndex === index 
                                        ? 'max-h-96 opacity-100' 
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className='px-4 pb-4 ml-9'>
                                    <p className='text-gray-600'>{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;