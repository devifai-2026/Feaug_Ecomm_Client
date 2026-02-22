import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../../apis/categoryApi';
import one from "../../assets/BottomBanner/one.png"
import two from "../../assets/BottomBanner/two.avif"
import three from "../../assets/BottomBanner/three.webp"
import four from "../../assets/BottomBanner/four.png"
import five from "../../assets/BottomBanner/five.webp"
import six from "../../assets/BottomBanner/six.png"

// Static slots: image + keyword to match against API category names + fallback title
const STATIC_SLOTS = [
    { fallback: "Earrings",     keywords: ["earring"],   image: one,   animation: "zoom-in" },
    { fallback: "Necklaces",    keywords: ["necklace"],  image: two,   animation: "fade-left" },
    { fallback: "Rings",        keywords: ["ring"],      image: three, animation: "fade-up" },
    { fallback: "Bracelets",    keywords: ["bracelet"],  image: four,  animation: "fade-right" },
    { fallback: "Watches",      keywords: ["watch"],     image: five,  animation: "flip-left" },
    { fallback: "Accessories",  keywords: ["accessor"],  image: six,   animation: "flip-right" },
];

const BottomBanner = () => {
    const navigate = useNavigate();

    // Build initial list from fallbacks; replaced once API responds
    const [categories, setCategories] = useState(
        STATIC_SLOTS.map(s => ({ title: s.fallback, image: s.image, animation: s.animation }))
    );

    useEffect(() => {
        categoryApi.getAdminCategories({
            onSuccess: (response) => {
                if (response.success && response.data?.categories?.length) {
                    const apiCats = response.data.categories;

                    const matched = STATIC_SLOTS.map(slot => {
                        // Find the API category whose name contains one of the slot keywords
                        const found = apiCats.find(cat =>
                            slot.keywords.some(kw => cat.name.toLowerCase().includes(kw))
                        );
                        return {
                            title: found ? found.name : slot.fallback,
                            image: slot.image,
                            animation: slot.animation,
                        };
                    });

                    setCategories(matched);
                }
            },
            onError: () => {
                // Keep fallback titles on error
            },
        });
    }, []);

    const handleCardClick = (categoryTitle) => {
        navigate(`/categories?category=${encodeURIComponent(categoryTitle)}`);
    };

    return (
        <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
                <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden"
                    data-aos={category.animation}
                    data-aos-delay={`${(index + 1) * 100}`}
                    onClick={() => handleCardClick(category.title)}
                >
                    {/* Image */}
                    <img
                        className='w-full h-64 object-cover transition-all duration-300 group-hover:scale-105'
                        src={category.image}
                        alt={category.title}
                    />

                    {/* Title - Always visible on mobile & tablet, hover on desktop */}
                    <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 p-3 lg:transform lg:translate-y-full lg:group-hover:translate-y-0 transition-all duration-300">
                        <h3 className="text-black text-center text-lg uppercase tracking-widest">
                            {category.title}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BottomBanner;
