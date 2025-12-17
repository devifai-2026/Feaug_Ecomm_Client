import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaGem, FaCrown, FaRing, FaHeart, FaAward, FaShieldAlt } from 'react-icons/fa';

const Testimonials = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Mehta",
      role: "Bride",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "My wedding jewellery set was absolutely breathtaking! The craftsmanship exceeded my expectations. Every piece felt premium and timeless.",
      date: "2 days ago",
      verified: true,
      location: "Mumbai",
      product: "Kundan Wedding Set"
    },
    {
      id: 2,
      name: "Rohan Kapoor",
      role: "Husband",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "Purchased a diamond necklace for my wife's anniversary. The quality and sparkle are exceptional. She hasn't stopped receiving compliments!",
      date: "1 week ago",
      verified: true,
      location: "Delhi",
      product: "Diamond Pendant Set"
    },
    {
      id: 3,
      name: "Ananya Reddy",
      role: "Fashion Influencer",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 4,
      quote: "As someone who wears jewellery daily, I can vouch for the quality. Their gold purity is certified and designs are contemporary yet elegant.",
      date: "3 days ago",
      verified: true,
      location: "Bangalore",
      product: "Gold Daily Wear"
    },
    {
      id: 4,
      name: "Vikram Singhania",
      role: "Gift Buyer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "Bought pearl earrings for my mother's birthday. The packaging was luxurious and the certificate of authenticity gave me complete peace of mind.",
      date: "2 weeks ago",
      verified: true,
      location: "Hyderabad",
      product: "Pearl Earrings"
    },
    {
      id: 5,
      name: "Meera Choudhary",
      role: "Antique Collector",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "Their heritage collection is phenomenal! The attention to detail in traditional designs while maintaining modern wearability is impressive.",
      date: "1 month ago",
      verified: true,
      location: "Jaipur",
      product: "Heritage Collection"
    },
    {
      id: 6,
      name: "Arun Verma",
      role: "Investment Buyer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      rating: 4,
      quote: "Perfect blend of investment and beauty. The gold coins and bars come with proper certification, making them ideal for both gifting and investment.",
      date: "5 days ago",
      verified: true,
      location: "Kolkata",
      product: "Gold Coins"
    }
  ];

  const stats = [
    { value: "4.9/5", label: "Average Rating", icon: <FaGem className="text-amber-500" /> },
    { value: "25K+", label: "Happy Customers", icon: <FaHeart className="text-red-400" /> },
    { value: "99%", label: "Purity Guarantee", icon: <FaAward className="text-blue-400" /> },
    { value: "500+", label: "Designs", icon: <FaCrown className="text-purple-400" /> }
  ];

  const jewelleryCategories = [
    {
      category: "Diamond Jewellery",
      rating: 4.9,
      reviews: 1250,
      icon: <FaGem className="text-blue-300" />
    },
    {
      category: "Gold Collection",
      rating: 4.8,
      reviews: 2340,
      icon: <FaGem className="text-amber-400" />
    },
    {
      category: "Wedding Sets",
      rating: 4.9,
      reviews: 1890,
      icon: <FaRing className="text-pink-400" />
    },
    {
      category: "Daily Wear",
      rating: 4.7,
      reviews: 1876,
      icon: <FaHeart className="text-red-300" />
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-sm ${
              index < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaGem className="text-amber-500 text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sparkling Reviews from Our Valued Customers
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Join 25,000+ customers who trust us for certified, exquisite jewellery that tells your story
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 border border-amber-100"
            >
              <div className="flex justify-center text-3xl mb-2">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonials Carousel */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-1 mb-8">
            <div className="bg-white rounded-xl p-2">
              <div className="relative overflow-hidden rounded-lg">
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <FaChevronLeft className="text-gray-700" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <FaChevronRight className="text-gray-700" />
                </button>

                {/* Testimonial Slides */}
                <div className="flex transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 p-8 md:p-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-6">
                          <FaQuoteLeft className="text-amber-500 text-2xl" />
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                            {testimonial.product}
                          </span>
                        </div>
                        <p className="text-xl md:text-2xl font-light text-gray-800 mb-8 leading-relaxed italic">
                          "{testimonial.quote}"
                        </p>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-100">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                                {testimonial.verified && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{testimonial.role} • {testimonial.location}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {renderStars(testimonial.rating)}
                                <span className="text-sm text-gray-500">{testimonial.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-100">
                            <div className="text-4xl font-bold text-amber-600">
                              {testimonial.rating.toFixed(1)}
                            </div>
                            <div>
                              {renderStars(testimonial.rating)}
                              <div className="text-sm text-gray-500">Out of 5 stars</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-amber-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Category Excellence
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jewelleryCategories.map((category, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-amber-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.category}</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{category.rating}</div>
                    {renderStars(Math.floor(category.rating))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {category.reviews.toLocaleString()} verified reviews
                </div>
                <div className="mt-4 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    style={{ width: `${(category.rating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Jewellery Reviews</h2>
            <button className="text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1">
              View All Reviews <FaChevronRight className="text-sm" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-gradient-to-b from-white to-amber-50 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-amber-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  {renderStars(testimonial.rating)}
                </div>
                
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                    {testimonial.product}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-amber-100">
                  <span>{testimonial.date}</span>
                  <span className="flex items-center gap-1">
                    <FaGem className="text-amber-400 text-xs" />
                    {testimonial.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Certification Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <FaGem className="text-3xl mb-4 mx-auto text-white" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Certified Excellence, Guaranteed Purity
            </h2>
            <p className="mb-6 opacity-90">
              Every piece comes with BIS Hallmark certification and lifetime warranty. 
              Your trust is our most valuable jewel.
            </p>
           
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-amber-200">
          <div className="text-center text-gray-600">
            <p className="mb-6 font-medium">Why Customers Trust Us</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-white rounded-lg border border-amber-100">
                <FaGem className="text-amber-500 text-xl mb-2 mx-auto" />
                <div className="text-sm font-medium">BIS Hallmark Certified</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-100">
                <FaAward className="text-blue-400 text-xl mb-2 mx-auto" />
                <div className="text-sm font-medium">Certified Diamonds</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-100">
                <FaCrown className="text-purple-400 text-xl mb-2 mx-auto" />
                <div className="text-sm font-medium">Lifetime Warranty</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-100">
                <FaHeart className="text-red-400 text-xl mb-2 mx-auto" />
                <div className="text-sm font-medium">30-Day Return Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Legacy Section */}
        <div className="mt-12 bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Three Generations of Trust
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Since 1950, we've been crafting jewellery that becomes family heirlooms. 
              Our customers aren't just buying jewellery - they're investing in legacy.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 text-amber-600">
                <FaStar className="fill-amber-500" />
                <span className="font-semibold">Trusted by 3 generations of Indian families</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;