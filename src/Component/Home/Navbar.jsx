import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import banner from "../../assets/Banner/one.png";
import banneTwo from "../../assets/Banner/two.png";
import bannerThree from "../../assets/Banner/three.png";
import bannerFour from "../../assets/Banner/four.png";
import {
  LuUserRound,
  LuChevronDown,
  LuMenu,
  LuX,
  LuSearch,
  LuLogOut,
  LuUser,
  LuPackage,
  LuLogIn,
} from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdClose,
} from "react-icons/md";
import { FaArrowRightLong, FaRegHeart } from "react-icons/fa6";
import { useCart } from "../Context/CartContext";
import one from "../../assets/Navbar/eightAngle.webp";
import two from "../../assets/Navbar/fiveAngle.jpg";
import three from "../../assets/Navbar/oneAngle.webp";
import four from "../../assets/Navbar/sixAngle.avif";
import five from "../../assets/Navbar/threeAngle.webp";
import six from "../../assets/Navbar/twoAngle.webp";
import bannerApi from "../../apis/bannerApi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Categories sliding state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);

  // Get cart from context
  const { getTotalUniqueItems, fetchCartFromApi } = useCart();

  // Carousel content state
  const [carouselSlides, setCarouselSlides] = useState([
    {
      title: "Discover Sparkle",
      subtitle: "With Style",
      description:
        "Whether casual or formal, find the perfect jewelry for every occasion.",
      background: banner,
    },
    {
      title: "Elegant Collection",
      subtitle: "Timeless Beauty",
      description: "Explore our exclusive range of handcrafted jewelry pieces.",
      background: banneTwo,
    },
    {
      title: "Luxury Redefined",
      subtitle: "Premium Quality",
      description:
        "Experience the finest craftsmanship in every piece we create.",
      background: bannerThree,
    },
    {
      title: "Special Offers",
      subtitle: "Limited Edition",
      description: "Don't miss out on our exclusive seasonal collections.",
      background: bannerFour,
    },
  ]);

  // Refs for dropdowns
  const dropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const categoriesContainerRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Get wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          const wishlistItems = JSON.parse(savedWishlist);
          setWishlistCount(wishlistItems.length);
        } else {
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("Error parsing wishlist:", error);
        setWishlistCount(0);
      }
    };

    updateWishlistCount();
    const interval = setInterval(updateWishlistCount, 1000);

    return () => clearInterval(interval);
  }, []);

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }

      // Close categories dropdown
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close search modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  // Prevent body scroll when search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Mouse drag functionality for categories
  useEffect(() => {
    if (!isCategoriesOpen || !categoriesContainerRef.current) return;

    const container = categoriesContainerRef.current;

    const handleMouseDown = (e) => {
      // Check if the click is on a category button
      const categoryButton = e.target.closest('button[class*="group"]');
      if (categoryButton) {
        return; // Don't start dragging if clicking on a category button
      }

      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      setDragStartTime(Date.now());
      container.style.cursor = "grabbing";
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;

      // Prevent text selection during drag
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      container.style.cursor = "grab";

      // If it was a very short drag, treat it as a click on the container
      const dragDuration = Date.now() - dragStartTime;
      if (dragDuration < 150) {
        // Don't do anything on quick click - let click events handle it
      }
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        container.style.cursor = "grab";
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
      const categoryButton = e.target.closest('button[class*="group"]');
      if (categoryButton) {
        return;
      }

      setIsDragging(true);
      setStartX(e.touches[0].pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      setDragStartTime(Date.now());
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // Click event handler for container to prevent navigation during drag
    const handleClick = (e) => {
      // If we were dragging, prevent the click
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("click", handleClick, true);

    // Set initial cursor
    container.style.cursor = "grab";

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("click", handleClick, true);
    };
  }, [isCategoriesOpen, isDragging, startX, scrollLeft]);

  // Check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Categories data with images - Expanded list
  const categories = [
    { name: "Watches", image: one, path: "/categories" },
    { name: "Rings", image: two, path: "/categories" },
    { name: "Earrings", image: three, path: "/categories" },
    { name: "Necklaces", image: four, path: "/categories" },
    { name: "Bracelets", image: five, path: "/categories" },
    { name: "Anklets", image: six, path: "/categories" },
    { name: "Brooches", image: one, path: "/categories" },
    { name: "Pendants", image: two, path: "/categories" },
    { name: "Chains", image: three, path: "/categories" },
    { name: "Charms", image: four, path: "/categories" },
    { name: "Bangles", image: five, path: "/categories" },
    { name: "Cufflinks", image: six, path: "/categories" },
    { name: "All Jewelry", image: one, path: "/categories" },
  ];

  // Fetch carousel slides from API
  useEffect(() => {
    if (!isHomePage) return;

    bannerApi.getBannersByPage({
      page: "home",
      position: "top",
      onSuccess: (response) => {
        if (
          response.status === "success" &&
          response.data?.banners?.length > 0
        ) {
          const mappedSlides = [];
          response.data.banners.forEach((b) => {
            if (b.images && b.images.length > 0) {
              // Each image becomes its own slide, with per-image fields taking priority
              b.images.forEach((img) => {
                mappedSlides.push({
                  title: img.title || img.alt || b.title || "",
                  subtitle: img.subtitle || img.subheader || b.subheader || "",
                  description: img.description || b.body || "",
                  background: img.url || "",
                  redirectUrl: b.redirectUrl,
                  buttonText: b.buttonText || "Shop Now",
                });
              });
            } else {
              // No images — use banner-level data
              mappedSlides.push({
                title: b.title || "",
                subtitle: b.subheader || "",
                description: b.body || "",
                background: "",
                redirectUrl: b.redirectUrl,
                buttonText: b.buttonText || "Shop Now",
              });
            }
          });
          setCarouselSlides(mappedSlides);
        }
      },
      onError: (err) => {
        console.error("Failed to fetch carousel slides:", err);
      },
    });
  }, [isHomePage]);

  // Auto carousel effect
  useEffect(() => {
    if (!isHomePage) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHomePage, carouselSlides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSlideClick = (slide) => {
    if (slide.redirectUrl) {
      if (slide.redirectUrl.startsWith("http")) {
        window.location.href = slide.redirectUrl;
      } else {
        navigate(slide.redirectUrl);
      }
    } else {
      navigate("/categories");
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length,
    );
  };

  // Determine navbar background color
  const getNavbarBackground = () => {
    if (!isHomePage) return "bg-white";
    if (isScrolled) return "bg-white shadow-md";
    return "bg-transparent";
  };

  // Determine text color based on background
  const getTextColor = () => {
    if (!isHomePage) return "text-gray-800";
    if (isScrolled) return "text-gray-800";
    return "text-white";
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      // Close modal and navigate to search results
      setIsSearchOpen(false);
      // Here you would typically navigate to search results page
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
    setIsSearchOpen(false);
    console.log("Searching for:", search);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Handle user dropdown click
  const handleUserIconClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    // Close categories dropdown if open
    if (isCategoriesOpen) {
      setIsCategoriesOpen(false);
    }
  };

  // Handle categories dropdown click
  const handleCategoriesClick = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    // Close user dropdown if open
    if (isUserDropdownOpen) {
      setIsUserDropdownOpen(false);
    }
  };

  // Handle mobile categories toggle
  const handleMobileCategoriesToggle = () => {
    setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
  };

  // Handle dropdown item click
  const handleDropdownItemClick = (path) => {
    setIsUserDropdownOpen(false);
    navigate(path);
  };

  // Handle categories item click
  const handleCategoriesItemClick = (e, category) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsCategoriesOpen(false);

    // If it's "All Jewelry", just navigate to /categories
    // Otherwise, add the category name as a query parameter
    const path =
      category.name === "All Jewelry"
        ? "/categories"
        : `/categories?category=${encodeURIComponent(category.name)}`;

    navigate(path);

    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Check if user is logged in (you can implement your own logic)
  const isLoggedIn = () => {
    // Check if user is logged in (you can check localStorage, context, etc.)
    const user = localStorage.getItem("user");
    return !!user;
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsUserDropdownOpen(false);

    // Refresh cart to reflect guest state
    fetchCartFromApi();

    navigate("/");
    // You can add a toast notification here
    console.log("Logged out successfully");
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative">
      {/* Search Modal */}
      {isSearchOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[60] transition-all duration-300"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Search Modal Content */}
          <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fadeIn">
              {/* Search Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Products
                  </h2>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <MdClose className="text-2xl text-gray-600" />
                  </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for jewelry, categories, or brands..."
                      className="w-full pl-12 pr-24 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#C19A6B] focus:bg-white transition-all duration-300 text-lg"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C19A6B] text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-300 font-medium"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Search Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                        >
                          <LuSearch className="text-gray-500 text-sm" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-2 md:px-10 lg:px-12 transition-all duration-300 ${getNavbarBackground()}`}
      >
        <div className="w-full px-4 mx-auto flex justify-between items-center">
          {/* Left Section - Logo */}
          <div className="lg:hidden">
            <Link to="/">
              <h2 className={`uppercase text-2xl font-bold  ${getTextColor()}`}>
                Feauag
              </h2>
            </Link>
          </div>

          {/* Center Section - Navigation Links (Desktop) */}
          <div
            className={`hidden lg:flex items-center gap-6 ${getTextColor()}`}
          >
            {/* Categories with Dropdown */}
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                onClick={handleCategoriesClick}
                className="flex items-center gap-1 group"
              >
                <p
                  className={`transition-colors duration-300 ${isActiveLink("/categories")
                      ? "text-[#C19A6B]"
                      : getTextColor()
                    } hover:text-[#C19A6B]`}
                >
                  Categories
                </p>
                <LuChevronDown
                  className={`text-sm transition-all duration-200 ${isActiveLink("/categories")
                      ? "text-[#C19A6B]"
                      : "group-hover:text-[#C19A6B]"
                    } ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Categories Dropdown - Enhanced with drag functionality */}

              {isCategoriesOpen && (
                <div className="fixed left-1/2 transform -translate-x-1/2 top-14 bg-white shadow-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn min-w-[500px] max-w-[100vw]">
                  <div className="">
                    {/* Horizontal scrollable container with hidden scrollbar */}
                    <div
                      ref={categoriesContainerRef}
                      className="flex gap-4 pb-2 px-4 select-none"
                      style={{
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        cursor: "grab",
                        scrollBehavior: "smooth",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                      }}
                    >
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-shrink-0 w-52"
                        >
                          <button
                            onClick={(e) =>
                              handleCategoriesItemClick(e, category)
                            }
                            className="flex flex-col items-center group cursor-pointer select-none w-full"
                          >
                            <div className="w-full h-64 mb-2 overflow-hidden">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-medium text-gray-800 group-hover:text-[#C19A6B] transition-colors duration-300 whitespace-nowrap">
                                {category.name}
                              </span>
                              <FaArrowRightLong className="text-[#C19A6B] text-sm" />
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <style>{`
                    div[style*="overflow-x: auto"]::-webkit-scrollbar {
                      display: none;
                    }
                    .select-none {
                      -webkit-user-select: none;
                      -moz-user-select: none;
                      -ms-user-select: none;
                      user-select: none;
                    }
                  `}</style>
                </div>
              )}
            </div>

            <Link to="/about">
              <p
                className={`cursor-pointer transition-colors duration-300 ${isActiveLink("/about") ? "text-[#C19A6B]" : getTextColor()
                  } hover:text-[#C19A6B]`}
              >
                About
              </p>
            </Link>

            <Link to="/contact">
              <p
                className={`cursor-pointer transition-colors duration-300 ${isActiveLink("/contact") ? "text-[#C19A6B]" : getTextColor()
                  } hover:text-[#C19A6B]`}
              >
                Contact
              </p>
            </Link>
          </div>

          {/* Center Logo - Only visible on lg devices */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <h2
                className={`uppercase text-3xl font-bold font-passenger ${getTextColor()}`}
              >
                Feauag
              </h2>
            </Link>
          </div>

          {/* Right Section - User Actions */}
          <div className={`flex items-center gap-2 ${getTextColor()}`}>
            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3">
                <p className="transition-colors duration-300 hover:text-[#C19A6B] ">
                  INR
                </p>
              </div>

              <div className="flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3">
                <p className="transition-colors duration-300 hover:text-[#C19A6B]">
                  EN
                </p>
              </div>

              <div
                className="flex items-center gap-3 relative"
                ref={dropdownRef}
              >
                {/* User Icon with Dropdown */}
                <button onClick={handleUserIconClick} className="relative">
                  <LuUserRound className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300" />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      {isLoggedIn() ? (
                        <>
                          <button
                            onClick={() =>
                              handleDropdownItemClick("/myProfile")
                            }
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] transition-colors duration-200"
                          >
                            <LuUser className="text-lg" />
                            <span className="font-medium">My Profile</span>
                          </button>
                          <button
                            onClick={() => handleDropdownItemClick("/myOrders")}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] transition-colors duration-200"
                          >
                            <LuPackage className="text-lg" />
                            <span className="font-medium">My Orders</span>
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                          >
                            <LuLogOut className="text-lg" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDropdownItemClick("/login")}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] transition-colors duration-200"
                        >
                          <LuLogIn className="text-lg" />
                          <span className="font-medium">Login / Register</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Search Icon - Desktop */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                >
                  <HiOutlineMagnifyingGlass />
                </button>

                <div className="flex items-center gap-5">
                  {/* Wishlist */}
                  <Link to="/wishlist">
                    <div className="relative">
                      <FaRegHeart className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300" />
                      <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    </div>
                  </Link>
                  {/* Shopping Bag */}
                  <Link to="/cart">
                    <div className="relative">
                      <BsHandbag className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300" />
                      <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {getTotalUniqueItems()}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile User Actions - REMOVED SEARCH ICON */}
            <div className="flex lg:hidden items-center gap-3">
              {/* REMOVED: Search Icon from mobile navbar */}

              {/* Wishlist */}
              <Link to="/wishlist">
                <div className="relative">
                  <FaRegHeart className="text-lg cursor-pointer hover:text-[#C19A6B] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </div>
              </Link>
              {/* Shopping Bag */}
              <Link to="/cart">
                <div className="relative">
                  <BsHandbag className="text-lg cursor-pointer hover:text-[#C19A6B] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalUniqueItems()}
                  </span>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={`text-xl transition-colors duration-300 hover:text-[#C19A6B] ${getTextColor()}`}
                onClick={handleMobileMenuToggle}
              >
                {isMobileMenuOpen ? <LuX /> : <LuMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Smooth Slide In */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "visible" : "invisible"
            }`}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-50" : "opacity-0"
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                className="text-xl text-gray-600 hover:text-[#C19A6B] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LuX />
              </button>
            </div>

            {/* Smooth Scrollable Content */}
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto smooth-scroll">
                <div className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      {/* User dropdown in mobile */}
                      <div className="space-y-2">
                        {isLoggedIn() ? (
                          <>
                            <button
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate("/myProfile");
                              }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] rounded-lg transition-colors duration-200"
                            >
                              <LuUser className="text-lg" />
                              <span className="font-medium">My Profile</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate("/myOrders");
                              }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] rounded-lg transition-colors duration-200"
                            >
                              <LuPackage className="text-lg" />
                              <span className="font-medium">My Orders</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                              }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-lg transition-colors duration-200"
                            >
                              <LuLogOut className="text-lg" />
                              <span className="font-medium">Logout</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate("/login");
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] rounded-lg transition-colors duration-200"
                          >
                            <LuLogIn className="text-lg" />
                            <span className="font-medium">
                              Login / Register
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Search in Drawer */}
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSearchOpen(true);
                        }}
                        className="flex items-center gap-3 cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors w-full"
                      >
                        <HiOutlineMagnifyingGlass className="text-lg text-gray-600" />
                        <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">
                          Search
                        </span>
                      </button>
                    </div>

                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                        <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">
                          INR
                        </span>
                      </div>
                      <div className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                        <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">
                          EN
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pb-4 border-b border-gray-200">
                      {/* Mobile Categories Section with Dropdown Toggle */}
                      <div className="pb-2">
                        <button
                          onClick={handleMobileCategoriesToggle}
                          className="flex items-center justify-between w-full cursor-pointer py-2 px-3 rounded-lg transition-colors hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-800">
                            Categories
                          </span>
                          <LuChevronDown
                            className={`transition-transform duration-300 ${isMobileCategoriesOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {/* Categories Dropdown Content */}
                        {isMobileCategoriesOpen && (
                          <div className="pl-4 space-y-1 mt-1 animate-fadeIn">
                            {categories.map((category, index) => (
                              <button
                                key={index}
                                onClick={(e) =>
                                  handleCategoriesItemClick(e, category)
                                }
                                className="flex items-center gap-3 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#C19A6B] rounded-lg transition-colors duration-200 text-left"
                              >
                                <span className="font-medium">
                                  {category.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div
                          className={`cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink("/about") ? "bg-gray-50" : ""
                            }`}
                        >
                          <span
                            className={`font-medium transition-colors duration-300 ${isActiveLink("/about")
                                ? "text-[#C19A6B]"
                                : "text-gray-800 hover:text-[#C19A6B]"
                              }`}
                          >
                            About
                          </span>
                        </div>
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div
                          className={`cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink("/contact") ? "bg-gray-50" : ""
                            }`}
                        >
                          <span
                            className={`font-medium transition-colors duration-300 ${isActiveLink("/contact")
                                ? "text-[#C19A6B]"
                                : "text-gray-800 hover:text-[#C19A6B]"
                              }`}
                          >
                            Contact
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Auto Carousel - Only on Home Page */}
      {isHomePage && (
        <div className="relative min-h-[calc(100vh-4rem)] md:min-h-screen">
          {/* Carousel Slides */}
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              style={{ backgroundImage: `url(${slide.background})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>

              {/* Carousel Content */}
              <div
                className={`relative z-10 flex flex-col items-center justify-center text-center text-white min-h-[calc(100vh-4rem)] md:min-h-screen px-4 mx-auto ${index === currentSlide ? "translate-y-0" : "translate-y-10"
                  }`}
              >
                {slide.title && (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-2 md:mb-3 drop-shadow-lg uppercase leading-tight">
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-4 drop-shadow-lg uppercase leading-tight">
                    {slide.subtitle}
                  </h1>
                )}
                {slide.description && (
                  <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 drop-shadow-md max-w-xs sm:max-w-sm md:max-w-xl px-2">
                    {slide.description}
                  </p>
                )}
                <button
                  onClick={() => handleSlideClick(slide)}
                  className="bg-transparent text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 transition duration-300 transform hover:scale-110 text-sm sm:text-base border-t-2 border-b-2 border-r border-l hover:border-[#C19A6B]"
                >
                  {slide.buttonText || "Shop Now"}
                </button>
              </div>
            </div>
          ))}

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-110"
                  }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 hover:text-[#C19A6B]"
          >
            <MdKeyboardArrowLeft className="text-base" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 hover:text-[#C19A6B]"
          >
            <MdKeyboardArrowRight className="text-base" />
          </button>
        </div>
      )}

      {/* Spacer for fixed navbar on non-home pages */}
      {!isHomePage && <div className="h-16"></div>}
    </div>
  );
};

export default Navbar;
