import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../../apis/categoryApi';
import one from "../../assets/BottomBanner/one.png"
import two from "../../assets/BottomBanner/two.avif"
import three from "../../assets/BottomBanner/three.webp"
import four from "../../assets/BottomBanner/four.png"
import five from "../../assets/BottomBanner/five.webp"
import six from "../../assets/BottomBanner/six.png"

const fallbackImages = [one, two, three, four, five, six];
const animations = ["zoom-in", "fade-left", "fade-up", "fade-right", "flip-left", "flip-right"];

const BottomBanner = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryApi.getAdminCategories({
            onSuccess: (response) => {
                if (response.success && response.data?.categories?.length) {
                    const active = response.data.categories
                        .filter((cat) => cat.isActive && (!cat.categoryType || cat.categoryType === "main"))
                        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                        .map((cat, index) => ({
                            title: cat.name,
                            image:
                                cat.image && cat.image !== "default-category.jpg"
                                    ? cat.image
                                    : fallbackImages[index % fallbackImages.length],
                            animation: animations[index % animations.length],
                        }));
                    setCategories(active);
                }
            },
            onError: () => {},
        });
    }, []);

    const handleCardClick = (categoryTitle) => {
        navigate(`/categories?category=${encodeURIComponent(categoryTitle)}`);
    };

    if (categories.length === 0) return null;

    return (
        <div
            className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`,
            }}
        >
            {categories.map((category, index) => (
                <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden"
                    data-aos={category.animation}
                    data-aos-delay={`${(index + 1) * 100}`}
                    onClick={() => handleCardClick(category.title)}
                >
                    <img
                        className='w-full h-64 object-cover transition-all duration-300 group-hover:scale-105'
                        src={category.image}
                        alt={category.title}
                        onError={(e) => {
                            e.target.src = fallbackImages[index % fallbackImages.length];
                        }}
                    />
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
