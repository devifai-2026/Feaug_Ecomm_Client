import { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import bannerApi from '../../apis/bannerApi';

const SliderLogo = () => {
    const [logos, setLogos] = useState([]);

    useEffect(() => {
        bannerApi.getBannersByPage({
            page: 'category',
            bannerType: 'slider',
            onSuccess: (data) => {
                if (data.status === 'success' && data.data?.banners?.length > 0) {
                    const images = data.data.banners
                        .flatMap(b => (b.images || []).map(img => img.url))
                        .filter(Boolean);
                    if (images.length) setLogos(images);
                }
            },
            onError: () => {},
        });
    }, []);

    if (logos.length === 0) return null;

    return (
        <div className='bg-gray-50 py-6 md:py-8 overflow-hidden mt-16'>
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
                        alt={`Brand ${index + 1}`}
                        className='h-10 md:h-14 lg:h-20 w-auto object-contain mx-8 md:mx-12'
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default SliderLogo;
