import React from 'react';
import Marquee from 'react-fast-marquee';
import one from "../../assets/SliderLogo/one.jpg"
import two from "../../assets/SliderLogo/two.jpg"
import three from "../../assets/SliderLogo/three.jpg"
import four from "../../assets/SliderLogo/four.jpg"
import five from "../../assets/SliderLogo/five.jpg"

const SliderLogo = () => {
    const logos = [one, two, three, four, five];
    
    return (
        <div className='bg-slate-100 py-6 md:py-8 overflow-hidden mt-16'>
            <Marquee
                speed={40}
                gradient={false}
                pauseOnHover={true}
                autoFill={true}
                className='flex items-center'
            >
                {logos.map((logo, index) => (
                    <img 
                        key={index}
                        src={logo} 
                        alt={`Logo ${index + 1}`} 
                        className='h-10 md:h-14 lg:h-20 w-auto object-contain mx-8 md:mx-12' 
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default SliderLogo;