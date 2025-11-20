import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import img from "../../../assets/Features/freepik__portrait-of-a-girl-with-sparkling-jewelry-radiant-__27577.png";
import {
  BsArrowLeft,
  BsHeart,
  BsShare,
  BsCurrencyDollar,
  BsStarFill,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import RelatedProducts from "./RelatedProduct";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("DESCRIPTION");
  const thumbnailContainerRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productImages = [img, img, img, img, img, img, img];

  const product = {
    id: id,
    subtitle: "River Luxe Collection",
    title: "Diamond Necklace",
    price: 299.99,
    description:
      "This exquisite diamond necklace features brilliant cut diamonds set in premium 18k gold. Perfect for special occasions and everyday elegance.",
    rating: 4.5,
    reviews: 64,
    productNumber: "PN-12345",
    category: "Necklaces",
    tags: ["Diamond", "Gold", "Luxury", "Elegant"],
    delivery: "check your location",
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <BsStarFill
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 100;
      thumbnailContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "DESCRIPTION":
        return (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Introducing our exquisite Rhea Gold Earrings from the River Luxe Collection. 
              These earrings are the epitome of sophistication and grace, designed to make 
              a statement on any occasion. Crafted with meticulous attention to detail, 
              they showcase the timeless beauty of diamonds in a breathtaking drop design.
            </p>
            
            <p className="text-gray-600 leading-relaxed mt-4">
              The diamonds, carefully selected for their exceptional quality, radiate 
              brilliance and sparkle with every movement. Set in lustrous 18K pure gold, 
              these earrings exude a luxurious and refined aura. The white gold complements 
              the diamonds beautifully, enhancing its natural luminosity and creating a 
              harmonious combination of elegance and glamour. Come with secure lever-back 
              closures, providing both a secure fit and ease of wearing. The lightweight 
              design ensures that you can enjoy wearing these earrings for extended periods 
              without any discomfort.
            </p>
            
            <p className="text-gray-600 leading-relaxed mt-4">
              Whether you're attending a formal event, celebrating a special occasion, 
              or simply want to elevate your everyday style, these Diamond Drop Earrings 
              are the perfect choice. They effortlessly add a touch of sophistication and 
              glamour to any ensemble, making them a versatile and timeless accessory.
            </p>
          </div>
        );
      case "DETAILS":
        return (
          <div className="text-gray-600 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Product Specifications</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Material:</span>
                    <span>18K Pure Gold</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Diamond Quality:</span>
                    <span>VS1-SI1</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Diamond Color:</span>
                    <span>G-H</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Closure Type:</span>
                    <span>Lever-back</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dimensions</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Length:</span>
                    <span>2.5 inches</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Width:</span>
                    <span>0.5 inches</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Weight:</span>
                    <span>3.2 grams</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "SIZING GUIDE":
        return (
          <div className="text-gray-600 space-y-4">
            <h3 className="font-semibold text-lg">Earring Sizing Guide</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Small (1-1.5 inches)</h4>
                <p className="text-sm">Perfect for everyday wear and subtle elegance</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Medium (1.5-2.5 inches)</h4>
                <p className="text-sm">Ideal for special occasions and evening events</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Large (2.5+ inches)</h4>
                <p className="text-sm">Make a bold statement for formal events</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Care Instructions</h4>
              <ul className="text-sm space-y-1">
                <li>• Store in original box or soft pouch</li>
                <li>• Avoid contact with water and chemicals</li>
                <li>• Clean with soft cloth regularly</li>
                <li>• Remove before swimming or showering</li>
              </ul>
            </div>
          </div>
        );
      case "REVIEWS":
        return (
          <div className="text-gray-600 space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="flex items-center gap-1">
                  {renderStars(4.8)}
                </div>
                <div className="text-sm text-gray-500">64 reviews</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-4">{star}</span>
                    <BsStarFill className="text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '5%' : '0%'}` }}
                      ></div>
                    </div>
                    <span className="text-sm w-8">
                      {star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '5%' : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(5)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
                <p>Absolutely stunning! The craftsmanship is exceptional and they're so comfortable to wear all day.</p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(4)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 month ago</span>
                </div>
                <p>Beautiful earrings, perfect for my wife's birthday. The gold quality is excellent.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[90%] mx-auto py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <BsArrowLeft className="text-lg" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div className="">
            {/* Main Image - No arrows */}
            <div className="relative flex justify-center p-2 sm:p-4">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.title}
                className="w-full max-w-md h-[350px] sm:h-[450px] object-contain"
              />
            </div>

            {/* Thumbnail Images with Scroll - Fixed scrollbar */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-4">
              <button
                onClick={() => scrollThumbnails("left")}
                className="p-1 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              >
                <BsChevronLeft className="text-gray-600 text-sm sm:text-base" />
              </button>

              <div
                ref={thumbnailContainerRef}
                className="flex gap-1 sm:gap-2 overflow-x-auto max-w-xs md:max-w-md px-1 sm:px-2 scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 cursor-pointer border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-orange-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollThumbnails("right")}
                className="p-1 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              >
                <BsChevronRight className="text-gray-600 text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link
                to="/"
                className="cursor-pointer hover:text-gray-700 transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">|</span>
              <span className="cursor-pointer hover:text-gray-700 transition-colors">
                Products
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-800 font-medium">Details</span>
            </div>

            <p className="text-yellow-700 uppercase">{product.subtitle}</p>
            <h1 className="text-3xl font-bold text-gray-800">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-gray-700 flex items-center gap-1">
                <BsCurrencyDollar />
                {product.price}
              </p>
              <span className="text-green-600 font-medium">In Stock</span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 text-sm">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-50 transition-colors">
                  <BsHeart className="text-xl text-gray-600 hover:text-red-500" />
                </button>
                <button className="p-2 hover:bg-gray-50 transition-colors">
                  <BsShare className="text-xl text-gray-600 hover:text-blue-500" />
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 ">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <button className="flex-1 bg-black text-white py-3 px-6  hover:bg-gray-800 transition-colors font-semibold">
                Add to Cart
              </button>
            </div>

            {/* Additional Product Information */}
            <div className="border-t pt-4 space-y-1">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Product Number:</span>
                <span className="font-medium">{product.productNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Tags:</span>
                <span className="font-medium">{product.tags.join(", ")}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium text-gray-600 underline">
                  {product.delivery}
                </span>
              </div>
            </div>
          </div>
          
          {/* Description Details Tabs - Vertical Layout */}
          <div className="lg:col-span-2 mt-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Vertical Tabs Navigation */}
              <div className="lg:w-1/4">
                <div className="space-y-1 border-r border-gray-200 pr-4">
                  {["DESCRIPTION", "DETAILS", "SIZING GUIDE", "REVIEWS"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-40 lg:w-full text-center lg:text-left py-3  px-4 font-medium transition-colors ${
                        activeTab === tab 
                          ? "bg-black text-white" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="lg:w-3/4 py-2">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
};

export default ProductDetails;