import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegHeart,
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
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
import { IoMdShare, IoMdClose } from "react-icons/io";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxDividerVertical, RxDragHandleHorizontal } from "react-icons/rx";
import SliderLogo from "./SliderLogo";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

const Category = () => {
  const [priceRange, setPriceRange] = useState([250, 5000]);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [layout, setLayout] = useState("grid"); // 'grid' or 'list'
  const productsPerPage = 12;

  const navigate =useNavigate();

   const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Mock products data - same 12 products
  const baseProducts = [
    {
      id: 1,
      name: "Femme Chronos Watch",
      price: 99.99,
      image: one,
      material: "Gold",
      brand: "Rollage",
    },
    {
      id: 2,
      name: "Birthday Charm Bracelet",
      price: 69.99,
      image: two,
      material: "Silver",
      brand: "Rollage",
    },
    {
      id: 3,
      name: "Pearl Stud Earrings",
      price: 49.99,
      image: three,
      material: "Gold",
      brand: "Rollage",
    },
    {
      id: 4,
      name: "Diamond Elegance Ring",
      price: 299.99,
      image: four,
      material: "Platinum",
      brand: "Rollage",
    },
    {
      id: 5,
      name: "Vintage Gold Necklace",
      price: 199.99,
      image: five,
      material: "Gold",
      brand: "Rollage",
    },
    {
      id: 6,
      name: "Silver Moon Brooch",
      price: 79.99,
      image: six,
      material: "Silver",
      brand: "Rollage",
    },
    {
      id: 7,
      name: "Platinum Royal Watch",
      price: 599.99,
      image: seven,
      material: "Platinum",
      brand: "Rollage",
    },
    {
      id: 8,
      name: "Rose Gold Bracelet",
      price: 149.99,
      image: eight,
      material: "Gold",
      brand: "Rollage",
    },
    {
      id: 9,
      name: "Classic Pearl Necklace",
      price: 89.99,
      image: one,
      material: "Silver",
      brand: "Rollage",
    },
    {
      id: 10,
      name: "Modern Diamond Earrings",
      price: 399.99,
      image: two,
      material: "Platinum",
      brand: "Rollage",
    },
    {
      id: 11,
      name: "Golden Heritage Brooch",
      price: 129.99,
      image: three,
      material: "Gold",
      brand: "Rollage",
    },
    {
      id: 12,
      name: "Silver Chrono Watch",
      price: 199.99,
      image: four,
      material: "Silver",
      brand: "Rollage",
    },
  ];

  // Generate different sequences for each page
  const getShuffledProducts = (page) => {
    const productsCopy = [...baseProducts];

    if (page === 1) {
      return productsCopy;
    } else if (page === 2) {
      return [...productsCopy].reverse();
    } else if (page === 3) {
      return [...productsCopy.slice(4), ...productsCopy.slice(0, 4)];
    } else if (page === 4) {
      return [...productsCopy.slice(-4), ...productsCopy.slice(0, -4)];
    } else if (page === 5) {
      const evenItems = productsCopy.filter((_, index) => index % 2 === 0);
      const oddItems = productsCopy.filter((_, index) => index % 2 !== 0);
      return [...evenItems, ...oddItems];
    } else if (page === 6) {
      const firstHalf = productsCopy.slice(0, 6);
      const secondHalf = productsCopy.slice(6);
      const interleaved = [];
      for (let i = 0; i < 6; i++) {
        interleaved.push(firstHalf[i]);
        interleaved.push(secondHalf[i]);
      }
      return interleaved;
    } else if (page === 7) {
      const rotateBy = 3;
      return [
        ...productsCopy.slice(rotateBy),
        ...productsCopy.slice(0, rotateBy),
      ];
    } else if (page === 8) {
      const rotateBy = 6;
      return [
        ...productsCopy.slice(rotateBy),
        ...productsCopy.slice(0, rotateBy),
      ];
    } else if (page === 9) {
      const mid = Math.floor(productsCopy.length / 2);
      return [...productsCopy.slice(mid), ...productsCopy.slice(0, mid)];
    } else {
      const shuffled = [...productsCopy];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  };

  const currentProducts = useMemo(() => {
    return getShuffledProducts(currentPage);
  }, [currentPage]);

  const categories = [
    "Earrings",
    "Necklace",
    "Bracelet",
    "Rings",
    "Brooch",
    "Watches",
    "Men's Jewelry",
  ];

  const materials = [
    { name: "Gold", count: 150 },
    { name: "Silver", count: 320 },
    { name: "Platinum", count: 300 },
  ];

  const brands = [
    { name: "Rollage", count: 254 },
    { name: "HELEN & JAMES", count: 166 },
    { name: "ORE Jewelry", count: 120 },
    { name: "Roman Paul", count: 105 },
    { name: "KS Silverworks", count: 96 },
    { name: "Love, Executive", count: 72 },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

  const totalPages = 10;

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
    setPriceRange([250, 5000]);
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

  const getPageNumbers = () => {
    const pageNumbers = [];
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
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const getShowingText = () => {
    const startItem = (currentPage - 1) * 12 + 1;
    const endItem = Math.min(currentPage * 12, 120);
    return `Showing ${startItem}-${endItem} of 120 results.`;
  };

  const FilterButton = () => (
    <button
      onClick={() => setIsDrawerOpen(true)}
      className="lg:hidden fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
    >
      <FaFilter className="text-lg" />
    </button>
  );

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
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
                {(index === activeCategory || index === hoveredCategory) && (
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
          ))}
        </ul>
      </div>

      {/* Price Filter - CUSTOM PRICE BAR */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price</h3>

        <div className="text-sm text-gray-600 flex items-center gap-1 mb-4">
          Price: <MdOutlineCurrencyRupee />
          {priceRange[0]} - <MdOutlineCurrencyRupee />
          {priceRange[1]}
        </div>

        {/* Custom Price Bar */}
        <div className="px-2">
          <div className="relative">
            {/* Track */}
            <div className="h-2 bg-gray-300 rounded-full">
              {/* Filled Track */}
              <div
                className="h-2 bg-[#a67c00] rounded-full absolute top-0 left-0"
                style={{
                  width: `${((priceRange[1] - 250) / (5000 - 250)) * 100}%`,
                }}
              ></div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="250"
              max="5000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
            />

            {/* Custom Thumb */}
            <div
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[#a67c00] rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
              style={{
                left: `${((priceRange[1] - 250) / (5000 - 250)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Price Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>
              <MdOutlineCurrencyRupee className="inline" />
              250
            </span>
            <span>
              <MdOutlineCurrencyRupee className="inline" />
              5000
            </span>
          </div>
        </div>
      </div>

      {/* Material Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Material</h3>
        <div className="space-y-3">
          {materials.map((material, index) => (
            <div key={index} className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMaterials[material.name] || false}
                  onChange={() => handleMaterialToggle(material.name)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-600">{material.name}</span>
              </label>
              <span className="text-xs text-gray-500">({material.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands[brand.name] || false}
                  onChange={() => handleBrandToggle(brand.name)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-600">{brand.name}</span>
              </label>
              <span className="text-xs text-gray-500">({brand.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
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
  );

  return (
    <div className="min-h-screen bg-white">
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
            <div className="sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto">
              <SidebarContent />
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
                <select className="px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
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
                layout === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 "
                  : "space-y-4"
              }`}
            >
            {currentProducts.map((product) => (
    <div
      key={`${product.id}-${currentPage}`}
      className={`group relative bg-white transition-all duration-300 hover:border-2 border-amber-700 ${
        layout === "grid"
          ? ""
          : "flex border border-gray-200 "
      } ${
        hoveredProduct === `${product.id}-${currentPage}`
          ? " "
          : ""
      }`}
      onMouseEnter={() =>
        setHoveredProduct(`${product.id}-${currentPage}`)
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
        onClick={() => handleProductClick(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Action Icons - Static flex-col top-right for md and sm only */}
        <div 
          className="absolute top-2 right-2 flex flex-col space-y-2 opacity-100 md:opacity-100 lg:hidden"
          onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking icons
        >
          <button className="p-2 rounded-full text-[#a67c00] hover:text-red-600 transition-all duration-300 bg-white bg-opacity-80">
            <FaRegHeart className="text-xs md:text-sm" />
          </button>
          <button className="p-2 rounded-full text-[#a67c00] hover:text-blue-600 transition-all duration-300 bg-white bg-opacity-80">
            <IoMdShare className="text-xs md:text-sm" />
          </button>
          <button className="p-2 rounded-full text-[#a67c00] hover:text-green-600 transition-all duration-300 bg-white bg-opacity-80">
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
            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking icons
          >
            <button className="p-2 rounded-full text-[#a67c00] hover:text-red-600 transition-all duration-300">
              <FaRegHeart className="text-lg" />
            </button>
            <button className="p-2 rounded-full text-[#a67c00] hover:text-blue-600 transition-all duration-300">
              <IoMdShare className="text-lg" />
            </button>
            <button className="p-2 rounded-full text-[#a67c00] hover:text-green-600 transition-all duration-300">
              <FaShoppingBag className="text-lg" />
            </button>
          </div>

          {/* Product Title and Price - For desktop and tablet */}
          <div onClick={() => handleProductClick(product.id)}>
            <h3
              className={`font-semibold mb-1 text-sm line-clamp-2 text-white text-center cursor-pointer`}
            >
              {product.name}
            </h3>

            <p
              className={`text-sm font-medium flex items-center gap-1 justify-center text-white cursor-pointer`}
            >
              <MdOutlineCurrencyRupee className="text-base" />
              {product.price}
            </p>
          </div>
        </div>
      </div>

      {/* Product Title and Price - For mobile only (outside below the card) */}
      <div 
        className="md:hidden p-3 cursor-pointer"
        onClick={() => handleProductClick(product.id)}
      >
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 text-center">
          {product.name}
        </h3>
        <p className="text-sm font-medium flex items-center gap-1 justify-center text-gray-900">
          <MdOutlineCurrencyRupee className="text-base" />
          {product.price}
        </p>
      </div>

      {/* Additional info for list layout */}
      {layout === "list" && (
        <div 
          className="flex-1 p-4 cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          <p className="text-sm text-gray-600 mb-2">
            Material: {product.material}
          </p>
          <p className="text-sm text-gray-600">
            Brand: {product.brand}
          </p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            This beautiful {product.name.toLowerCase()} is perfect
            for any occasion...
          </p>
        </div>
      )}
    </div>
  ))}
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
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Floating Filter Button for Mobile */}
      <FilterButton />

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