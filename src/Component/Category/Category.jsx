import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaRegHeart,
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaHeart,
} from "react-icons/fa";
import topBanner from "../../assets/Categories/topBanner.png";
import bottomBanner from "../../assets/Categories/bottomBanner.png";
import one from "../../assets/Categories/one.webp";
import two from "../../assets/Categories/two.png";
import three from "../../assets/Categories/three.webp";
import four from "../../assets/Categories/four.webp";
import five from "../../assets/Categories/five.webp";
import six from "../../assets/Categories/six.webp";
import seven from "../../assets/Categories/seven.jpeg";
import eight from "../../assets/Categories/eight.webp";

import { IoMdClose } from "react-icons/io";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxDividerVertical, RxDragHandleHorizontal } from "react-icons/rx";
import SliderLogo from "./SliderLogo";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";
import { BsHeartFill } from "react-icons/bs";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import productApi from "../../apis/productApi";

import categoryApi from "../../apis/categoryApi";

const Category = () => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [layout, setLayout] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("Popularity");

  // API state for categories
  const [categories, setCategories] = useState(["All Jewelry"]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const productsPerPage = 12;

  const navigate = useNavigate();
  const location = useLocation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Sync with URL category parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam && categories.length > 0) {
      const index = categories.findIndex(
        (cat) => cat.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (index !== -1) {
        setActiveCategory(index);
      }
    }
  }, [location.search, categories]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Add to Cart Functionality
  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    // Check if product is out of stock
    if (product.stockStatus === "out_of_stock" || product.stockQuantity === 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    addToCart(
      {
        id: product._id || product.id,
        name: product.name,
        price: product.sellingPrice || product.price,
        image: product.images?.[0]?.url || product.image || one,
        material: product.material,
        brand: product.brand,
      },
      1,
    );

    toast.success(
      <div>
        <p className="font-semibold">Added to cart!</p>
        <p className="text-sm">{product.name}</p>
      </div>,
      {
        icon: "🛒",
        duration: 3000,
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
        },
      },
    );
  };

  // Wishlist Functionality
  const handleWishlistClick = (product, e) => {
    e.stopPropagation();

    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id);
      toast.custom(
        (t) => (
          <div className="animate-slideInRight max-w-md w-full bg-white shadow-lg flex border border-gray-200">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BsHeartFill className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Removed from wishlist
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.name} has been removed
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/wishlist");
                }}
                className="w-full border border-transparent p-4 flex items-center justify-center text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
              >
                View Wishlist
              </button>
            </div>
          </div>
        ),
        {
          duration: 4000,
        },
      );
    } else {
      addToWishlist({
        id: product._id || product.id,
        name: product.name,
        price: product.sellingPrice || product.price,
        image: product.images?.[0]?.url || product.image || one,
        material: product.material,
        brand: product.brand,
        inStock:
          product.stockStatus !== "out_of_stock" && product.stockQuantity !== 0,
      });

      toast.success(
        <div>
          <p className="font-semibold">Added to wishlist!</p>
          <p className="text-sm">{product.name}</p>
        </div>,
        {
          icon: "❤️",
          duration: 3000,
          style: {
            background: "#fff5f5",
            border: "1px solid #fca5a5",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      );
    }
  };

  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const materials = useMemo(() => {
    const predefinedMaterials = [
      "Gold",
      "Silver",
      "Platinum",
      "Diamond",
      "Pearl",
      "Gemstone",
    ];
    const counts = {};

    // Initialize counts
    predefinedMaterials.forEach((m) => (counts[m.toLowerCase()] = 0));

    // Count from products
    allProducts.forEach((product) => {
      if (product.material) {
        const mat = product.material.toLowerCase();
        // Check if product material matches or contains any of our predefined materials
        predefinedMaterials.forEach((p) => {
          if (mat.includes(p.toLowerCase())) {
            counts[p.toLowerCase()] = (counts[p.toLowerCase()] || 0) + 1;
          }
        });
      }
    });

    return predefinedMaterials.map((name) => ({
      name,
      count: counts[name.toLowerCase()] || 0,
    }));
  }, [allProducts]);

  const brands = useMemo(() => {
    const predefinedBrands = [
      "Rollage",
      "HELEN & JAMES",
      "ORE Jewelry",
      "Platinum Elite",
      "Silver Dreams",
      "Gold Heritage",
    ];
    const counts = {};

    // Initialize
    predefinedBrands.forEach((b) => (counts[b.toLowerCase()] = 0));

    // Count
    allProducts.forEach((product) => {
      if (product.brand) {
        const brandName = product.brand.toLowerCase();
        // Exact match or partial if desired, usually brand checks are exact
        predefinedBrands.forEach((pb) => {
          if (brandName === pb.toLowerCase()) {
            counts[pb.toLowerCase()] = (counts[pb.toLowerCase()] || 0) + 1;
          }
        });
      }
    });

    return predefinedBrands.map((name) => ({
      name,
      count: counts[name.toLowerCase()] || 0,
    }));
  }, [allProducts]);

  // Fetch all products on mount
  useEffect(() => {
    // Fetch Categories
    categoryApi.getAdminCategories({
      setLoading: setIsCategoriesLoading,
      onSuccess: (response) => {
        if (response.success && response.data?.categories) {
          const fetchedCategories = response.data.categories.map(
            (cat) => cat.name,
          );
          setCategories(["All Jewelry", ...fetchedCategories]);
        }
      },
      onError: (err) => {
        console.error("Failed to fetch categories:", err);
      },
    });

    setLoading(true);
    productApi.getAllProducts({
      params: { limit: 1000 },
      setLoading,
      onSuccess: (response) => {
        if (response.success && response.data?.products) {
          setAllProducts(response.data.products);
        } else {
          setAllProducts([]);
        }
      },
      onError: (err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        toast.error("Failed to load products");
        setAllProducts([]);
      },
    });
  }, []);

  // Filter products whenever filters or activeCategory changes
  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    const selectedCategoryName = categories[activeCategory];
    const isAllJewelry =
      !selectedCategoryName ||
      selectedCategoryName.toLowerCase().includes("all jewelry") ||
      selectedCategoryName.toLowerCase().includes("all jewellery") ||
      selectedCategoryName.toLowerCase() === "all";

    if (!isAllJewelry) {
      result = result.filter(
        (product) =>
          product.category?.name === selectedCategoryName ||
          product.subCategory?.name === selectedCategoryName,
      );
    }

    // Filter by Price
    result = result.filter(
      (product) =>
        product.sellingPrice >= priceRange[0] &&
        product.sellingPrice <= priceRange[1],
    );

    // Filter by Material
    const activeMaterials = Object.keys(selectedMaterials).filter(
      (m) => selectedMaterials[m],
    );
    if (activeMaterials.length > 0) {
      result = result.filter((product) =>
        activeMaterials.some((m) =>
          product.material?.toLowerCase().includes(m.toLowerCase()),
        ),
      );
    }

    // Filter by Brand
    const activeBrands = Object.keys(selectedBrands).filter(
      (b) => selectedBrands[b],
    );
    if (activeBrands.length > 0) {
      result = result.filter(
        (product) =>
          product.brand &&
          activeBrands.some(
            (brand) => brand.toLowerCase() === product.brand.toLowerCase(),
          ),
      );
    }

    // Filter by Size
    const activeSizes = Object.keys(selectedSizes).filter(
      (s) => selectedSizes[s],
    );
    if (activeSizes.length > 0) {
      result = result.filter(
        (product) => product.size && activeSizes.includes(product.size),
      );
    }

    // Sort
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Popularity") {
      result.sort(
        (a, b) =>
          (b.purchaseCount || 0) - (a.purchaseCount || 0) ||
          (b.ratingAverage || 0) - (a.ratingAverage || 0),
      );
    }
    // Default or Popularity (could use rating or views)

    setFilteredProducts(result);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [
    allProducts,
    activeCategory,
    categories,
    priceRange,
    selectedMaterials,
    selectedBrands,
    selectedSizes,
    sortBy,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [currentPage, filteredProducts]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 0) return [];

    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push("...");
    }
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i) && i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    if (totalPages > 1 && totalPages !== 1) {
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const getShowingText = () => {
    if (filteredProducts.length === 0) return "Showing 0 results";
    const startItem = (currentPage - 1) * productsPerPage + 1;
    const endItem = Math.min(
      currentPage * productsPerPage,
      filteredProducts.length,
    );
    return `Showing ${startItem}-${endItem} of ${filteredProducts.length} results.`;
  };

  const handleMaterialToggle = useCallback((material) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [material]: !prev[material],
    }));
  }, []);

  const handleBrandToggle = useCallback((brand) => {
    setSelectedBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  }, []);

  const handleSizeToggle = useCallback((size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: !prev[size],
    }));
  }, []);

  const clearAllFilters = () => {
    setSelectedMaterials({});
    setSelectedBrands({});
    setSelectedSizes({});
    setPriceRange([0, 1000000]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Sidebar JSX is rendered inline below (not as a sub-component) to avoid
  // React unmounting/remounting it on every state change, which caused
  // scroll-to-top when clicking checkboxes or interacting with the price slider.

  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-[#ebe8e392] py-2">
        <div className="max-w-[90%] mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-800 transition-colors">
            <p>Home</p>
          </Link>
          <p>|</p>
          <p className="text-gray-800">Products</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[90%] mx-auto py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* ── SIDEBAR CONTENT ── */}

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {isCategoriesLoading ? (
                    <div className="space-y-2 animate-pulse">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-6 bg-gray-100 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    categories.map((category, index) => (
                      <li key={index}>
                        <button
                          className={`w-full text-left py-1 transition-all duration-300 ease-in-out relative group ${
                            index === activeCategory
                              ? "text-black font-medium ml-3"
                              : "text-gray-600 hover:text-black hover:ml-3"
                          }`}
                          onMouseEnter={() => setHoveredCategory(index)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          onClick={() => setActiveCategory(index)}
                        >
                          {(index === activeCategory ||
                            index === hoveredCategory) && (
                            <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-[#a67c00] font-bold transition-all duration-300 text-2xl">
                              |
                            </span>
                          )}
                          <span className="transition-all duration-300 group-hover:font-medium">
                            {category}
                          </span>
                          <div
                            className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${
                              index === activeCategory
                                ? "opacity-100 scale-100"
                                : index === hoveredCategory
                                  ? "opacity-50 scale-100"
                                  : "opacity-0 scale-95"
                            }`}
                          />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price
                </h3>
                <div className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                  Price: <MdOutlineCurrencyRupee />
                  {priceRange[0].toLocaleString("en-IN")} -{" "}
                  <MdOutlineCurrencyRupee />
                  {priceRange[1].toLocaleString("en-IN")}
                </div>

                {/* Dual-thumb range slider */}
                <div className="px-2">
                  <div className="relative h-2 mt-4 mb-2">
                    {/* Grey track */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 rounded-full" />
                    {/* Gold filled segment between min and max thumbs */}
                    <div
                      className="absolute top-0 h-2 bg-[#a67c00] rounded-full"
                      style={{
                        left: `${(priceRange[0] / 1000000) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`,
                      }}
                    />

                    {/* Min thumb */}
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="500"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val < priceRange[1])
                          setPriceRange([val, priceRange[1]]);
                      }}
                      className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer price-slider-thumb"
                      style={{ zIndex: priceRange[0] > 900000 ? 5 : 3 }}
                    />

                    {/* Max thumb */}
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > priceRange[0])
                          setPriceRange([priceRange[0], val]);
                      }}
                      className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer price-slider-thumb"
                      style={{ zIndex: 4 }}
                    />
                  </div>

                  {/* Price Labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-4">
                    <span>
                      <MdOutlineCurrencyRupee className="inline" />0
                    </span>
                    <span>
                      <MdOutlineCurrencyRupee className="inline" />
                      10,00,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Material Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Material
                </h3>
                <div className="space-y-3">
                  {materials.map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMaterials[material.name] || false}
                          onChange={() => handleMaterialToggle(material.name)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm text-gray-600">
                          {material.name}
                        </span>
                      </label>
                      <span className="text-xs text-gray-500">
                        ({material.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Brands
                </h3>
                <div className="space-y-3">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands[brand.name] || false}
                          onChange={() => handleBrandToggle(brand.name)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm text-gray-600">
                          {brand.name}
                        </span>
                      </label>
                      <span className="text-xs text-gray-500">
                        ({brand.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Size
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeToggle(size)}
                      className={`py-2 text-sm border rounded transition-colors ${
                        selectedSizes[size]
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear All Filters */}
              <div className="border-t pt-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  X CLEAR ALL FILTER
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="col-span-12 lg:col-span-9">
            {/* Top Banner */}
            <div className="mb-10 relative max-w-[90%] mx-auto">
              <img
                className="h-[50vh] w-full object-cover"
                src={topBanner}
                alt="Categories Banner"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:left-[unset] lg:right-6 lg:translate-x-0 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col justify-between h-full text-center md:text-left p-4 sm:p-6 md:p-6 gap-36 md:gap-52 lg:gap-16">
                  {/* New Arrival text at top */}
                  <div>
                    <p className="uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start text-white text-sm md:text-base lg:text-lg">
                      New Arrival <RxDividerVertical className="text-white" />
                    </p>
                  </div>

                  {/* Rest of the content */}
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl text-white font-semibold">
                      Flower Power
                    </h2>
                    <div className="text-white">
                      <p className="text-sm md:text-base leading-tight">
                        Introducing our new mesmerizing jewelry collection
                      </p>
                      <p className="text-sm md:text-base leading-tight">
                        Mesmerizing your inner allure with the timeless elegance
                      </p>
                    </div>
                    <button className="border border-white text-white px-3 py-1.5 sm:px-4 sm:py-2 text-nowrap text-xs sm:text-sm w-[40%]">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Header */}
            <div className="lg:hidden flex items-center justify-between mb-6 mt-6">
              <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900">
                Our Products
              </h1>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="text-sm" />
                <span>Filters</span>
              </button>
            </div>

            {/* Header - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                  Our Products
                </h1>
                <p className="text-sm text-gray-600">{getShowingText()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black cursor-pointer bg-white"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                </select>

                <span className="text-sm text-[#a67c00]">|</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-2 transition-colors ${
                      layout === "grid"
                        ? "text-[#a67c00] "
                        : "text-gray-600 hover:text-[#a67c00]"
                    }`}
                  >
                    <HiOutlineSquares2X2 className="text-lg" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`p-2 transition-colors ${
                      layout === "list"
                        ? "text-[#a67c00] "
                        : "text-gray-600 hover:text-[#a67c00]"
                    }`}
                  >
                    <RxDragHandleHorizontal className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div
              className={`mb-12 ${
                layout === "grid" && currentProducts.length > 0
                  ? "grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 "
                  : "space-y-4"
              }`}
            >
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700 mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const isInWishlistItem = isInWishlist(
                    product._id || product.id,
                  );
                  // Handle different image structures (API vs Mock)
                  // API might return images array, Mock returned image property
                  // Also handle fallback to placeholder
                  const displayImage =
                    product.images?.[0]?.url || product.image || one;
                  const displayPrice = product.sellingPrice || product.price;
                  const isOutOfStock =
                    product.stockStatus === "out_of_stock" ||
                    product.stockQuantity === 0;

                  return (
                    <div
                      key={`${product._id || product.id}-${currentPage}`}
                      className={`group relative bg-white transition-all duration-300 hover:border-2 border-amber-700 ${
                        layout === "grid" ? "" : "flex border border-gray-200 "
                      } ${
                        hoveredProduct ===
                        `${product._id || product.id}-${currentPage}`
                          ? " "
                          : ""
                      }`}
                      onMouseEnter={() =>
                        setHoveredProduct(
                          `${product._id || product.id}-${currentPage}`,
                        )
                      }
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Make the image container clickable */}
                      <div
                        className={`relative bg-gray-100 overflow-hidden transition-all duration-300 cursor-pointer ${
                          layout === "grid"
                            ? "aspect-[3/4] "
                            : "w-48 aspect-[3/4] flex-shrink-0 "
                        }`}
                        onClick={() =>
                          handleProductClick(product._id || product.id)
                        }
                      >
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Out of Stock Overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="bg-white/90 text-gray-900 px-4 py-2 font-bold uppercase tracking-wider text-sm shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Action Icons - Static flex-col top-right for md and sm only */}
                        <div
                          className="absolute top-2 right-2 flex flex-col space-y-2 opacity-100 md:opacity-100 lg:hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Wishlist Button */}
                          <button
                            className={`p-2 rounded-full transition-all duration-300 bg-white bg-opacity-80 ${
                              isInWishlistItem
                                ? "text-red-500 hover:text-red-600"
                                : "text-[#a67c00] hover:text-red-600"
                            }`}
                            onClick={(e) => handleWishlistClick(product, e)}
                            title={
                              isInWishlistItem
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            {isInWishlistItem ? (
                              <BsHeartFill className="text-xs md:text-sm" />
                            ) : (
                              <FaHeart className="text-xs md:text-sm" />
                            )}
                          </button>

                          {/* Cart Button */}
                          <button
                            className={`p-2 rounded-full transition-all duration-300 bg-white bg-opacity-80 ${
                              isOutOfStock
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#a67c00] hover:text-green-600"
                            }`}
                            onClick={(e) =>
                              !isOutOfStock && handleAddToCart(product, e)
                            }
                            title={
                              isOutOfStock ? "Out of stock" : "Add to cart"
                            }
                            disabled={isOutOfStock}
                          >
                            <FaShoppingBag className="text-xs md:text-sm" />
                          </button>
                        </div>

                        {/* Product Info Overlay - For desktop and tablet */}
                        <div
                          className={`hidden md:block absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent `}
                        >
                          {/* Action Icons - Horizontal row above title (for lg devices only) */}
                          <div
                            className={`hidden lg:flex justify-center space-x-2 mb-2 transition-all duration-300 ${
                              layout === "grid"
                                ? "opacity-0 group-hover:opacity-100 "
                                : "opacity-100"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Wishlist Button */}
                            <button
                              className={`p-2 rounded-full transition-all duration-300 ${
                                isInWishlistItem
                                  ? "text-red-500 hover:text-red-600"
                                  : "text-[#a67c00] hover:text-red-600"
                              }`}
                              onClick={(e) => handleWishlistClick(product, e)}
                              title={
                                isInWishlistItem
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              {isInWishlistItem ? (
                                <BsHeartFill className="text-lg" />
                              ) : (
                                <FaRegHeart className="text-lg" />
                              )}
                            </button>

                            {/* Cart Button */}
                            <button
                              className={`p-2 rounded-full transition-all duration-300 ${
                                isOutOfStock
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-[#a67c00] hover:text-green-600"
                              }`}
                              onClick={(e) =>
                                !isOutOfStock && handleAddToCart(product, e)
                              }
                              title={
                                isOutOfStock ? "Out of stock" : "Add to cart"
                              }
                              disabled={isOutOfStock}
                            >
                              <FaShoppingBag className="text-lg" />
                            </button>
                          </div>

                          {/* Product Title and Price - For desktop and tablet */}
                          <div
                            onClick={() =>
                              handleProductClick(product._id || product.id)
                            }
                          >
                            <h3
                              className={`font-semibold mb-1 text-sm line-clamp-2 text-white text-center cursor-pointer`}
                            >
                              {product.name}
                            </h3>

                            <p
                              className={`text-sm font-medium flex items-center gap-1 justify-center text-white cursor-pointer`}
                            >
                              <MdOutlineCurrencyRupee className="text-base" />
                              {displayPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Product Title and Price - For mobile only (outside below the card) */}
                      <div
                        className="md:hidden p-3 cursor-pointer"
                        onClick={() =>
                          handleProductClick(product._id || product.id)
                        }
                      >
                        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 text-center">
                          {product.name}
                        </h3>
                        <p className="text-sm font-medium flex items-center gap-1 justify-center text-gray-900">
                          <MdOutlineCurrencyRupee className="text-base" />
                          {displayPrice}
                        </p>
                      </div>

                      {/* Additional info for list layout */}
                      {layout === "list" && (
                        <div
                          className="flex-1 p-4 cursor-pointer"
                          onClick={() =>
                            handleProductClick(product._id || product.id)
                          }
                        >
                          <p className="text-sm text-gray-600 mb-2">
                            Material: {product.material}
                          </p>
                          <p className="text-sm text-gray-600">
                            Brand: {product.brand}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {product.description ||
                              `This beautiful ${product.name.toLowerCase()} is perfect for any occasion...`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 mx-4">
                  <div className="mb-4">
                    <FaShoppingBag className="mx-auto text-4xl text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Products available in this category
                  </h3>
                  <p className="text-gray-600">
                    We couldn't find any products matching your current filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-6 text-amber-700 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full border border-gray-300 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <FaChevronLeft className="text-sm" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-1 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        currentPage === page
                          ? "bg-orange-700 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full border border-gray-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Filter Drawer */}
      <div
        className={`
                fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
                ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
            `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoMdClose className="text-lg" />
            </button>
          </div>
          <div className="p-4">
            {/* ── MOBILE SIDEBAR CONTENT ── */}

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {isCategoriesLoading ? (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-100 rounded w-full"
                      ></div>
                    ))}
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <li key={index}>
                      <button
                        className={`w-full text-left py-1 transition-all duration-300 ease-in-out relative group ${
                          index === activeCategory
                            ? "text-black font-medium ml-3"
                            : "text-gray-600 hover:text-black hover:ml-3"
                        }`}
                        onMouseEnter={() => setHoveredCategory(index)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => {
                          setActiveCategory(index);
                          setIsDrawerOpen(false);
                        }}
                      >
                        {(index === activeCategory ||
                          index === hoveredCategory) && (
                          <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-[#a67c00] font-bold transition-all duration-300 text-2xl">
                            |
                          </span>
                        )}
                        <span className="transition-all duration-300 group-hover:font-medium">
                          {category}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Price Filter - Mobile */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price
              </h3>
              <div className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                Price: <MdOutlineCurrencyRupee />
                {priceRange[0].toLocaleString("en-IN")} -{" "}
                <MdOutlineCurrencyRupee />
                {priceRange[1].toLocaleString("en-IN")}
              </div>
              <div className="px-2">
                <div className="relative h-2 mt-4 mb-2">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 rounded-full" />
                  <div
                    className="absolute top-0 h-2 bg-[#a67c00] rounded-full"
                    style={{
                      left: `${(priceRange[0] / 1000000) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="500"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < priceRange[1])
                        setPriceRange([val, priceRange[1]]);
                    }}
                    className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer price-slider-thumb"
                    style={{ zIndex: priceRange[0] > 900000 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > priceRange[0])
                        setPriceRange([priceRange[0], val]);
                    }}
                    className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer price-slider-thumb"
                    style={{ zIndex: 4 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <span>
                    <MdOutlineCurrencyRupee className="inline" />0
                  </span>
                  <span>
                    <MdOutlineCurrencyRupee className="inline" />
                    10,00,000
                  </span>
                </div>
              </div>
            </div>

            {/* Material Filter - Mobile */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Material
              </h3>
              <div className="space-y-3">
                {materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMaterials[material.name] || false}
                        onChange={() => handleMaterialToggle(material.name)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm text-gray-600">
                        {material.name}
                      </span>
                    </label>
                    <span className="text-xs text-gray-500">
                      ({material.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Filter - Mobile */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brands
              </h3>
              <div className="space-y-3">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands[brand.name] || false}
                        onChange={() => handleBrandToggle(brand.name)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm text-gray-600">
                        {brand.name}
                      </span>
                    </label>
                    <span className="text-xs text-gray-500">
                      ({brand.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Filter - Mobile */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeToggle(size)}
                    className={`py-2 text-sm border rounded transition-colors ${
                      selectedSizes[size]
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All Filters - Mobile */}
            <div className="border-t pt-4">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                X CLEAR ALL FILTER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Filter Button for Mobile */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <FaFilter className="text-lg" />
      </button>

      {/* Last Banner*/}
      <div className="mb-10 relative max-w-[90%] mx-auto">
        <img
          className="h-[50vh] w-full object-cover"
          src={bottomBanner}
          alt="Categories Banner"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:left-[unset] lg:right-6 lg:translate-x-0 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col justify-between h-full text-center md:text-left p-4 sm:p-6 md:p-6 gap-36 md:gap-52 lg:gap-24">
            {/* Collection text at top */}
            <div>
              <p className="uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start text-white text-sm md:text-base lg:text-lg">
                Collection <RxDividerVertical className="text-white" />
              </p>
            </div>

            {/* Rest of the content */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl text-white font-semibold">
                Sommelier
              </h2>
              <div className="text-white">
                <p className="text-sm md:text-base  leading-tight">
                  Introducing our new minimalistic collection
                </p>
                <p className="text-sm md:text-base  leading-tight">
                  Suitable for the active yet elegant
                </p>
              </div>
              <button className="border border-white text-white px-3 py-1.5 sm:px-4 sm:py-2 text-nowrap text-xs sm:text-sm w-[40%]">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <SliderLogo></SliderLogo>
    </div>
  );
};

export default Category;
