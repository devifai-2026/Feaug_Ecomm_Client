import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
  FaRegHeart,
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import topBanner from "../../assets/Categories/topBanner.png";
import bottomBanner from "../../assets/Categories/bottomBanner.png"
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
import { RxDividerVertical } from "react-icons/rx";
import SliderLogo from "./SliderLogo";

const Category = () => {
  const [priceRange, setPriceRange] = useState([250, 5000]);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const productsPerPage = 12;

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
    <div className="h-full overflow-y-auto">
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                className={`w-full text-left py-1 transition-colors ${
                  index === 0
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price</h3>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            Price: <MdOutlineCurrencyRupee />
            {priceRange[0]} - <MdOutlineCurrencyRupee />
            {priceRange[1]}
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="250"
              max="5000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
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
<div className="mb-10 relative">
  <img
    className="h-[50vh] w-full object-cover"
    src={topBanner}
    alt="Categories Banner"
  />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl lg:top-1/2 lg:left-auto lg:right-6 lg:translate-x-0 p-3 sm:p-4 md:p-6">
    <div className="text-center md:text-left bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
      <p className="uppercase tracking-widest flex items-center gap-2 mb-4 sm:mb-6 justify-center md:justify-start text-black text-sm md:text-base lg:text-lg">
        New Arrival <RxDividerVertical className="text-black" />
      </p>
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl md:text-3xl text-black font-semibold">
          Flower Power
        </h2>
        <div className="text-gray-800 ">
          <p className="text-xs sm:text-sm leading-tight">
            Introducing our new mesmerizing jewelry collection
          </p>
          <p className="text-xs sm:text-sm leading-tight">
            Mesmerizing your inner allure with the timeless elegance
          </p>
        </div>
        <button className=" border border-black text-black px-3 py-1.5 sm:px-4 sm:py-2 text-nowrap mt-3 sm:mt-4   text-xs sm:text-sm">
          Shop Now
        </button>
      </div>
    </div>
  </div>
</div>
            {/* Mobile Filter Header */}
            <div className="lg:hidden flex items-center justify-between mb-6 mt-6">
              <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Our Products
                </h1>
                <p className="text-sm text-gray-600">{getShowingText()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-12">
              {currentProducts.map((product) => (
                <div
                  key={`${product.id}-${currentPage}`}
                  className="group relative bg-white rounded-lg transition-all duration-300"
                  onMouseEnter={() =>
                    setHoveredProduct(`${product.id}-${currentPage}`)
                  }
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image Container - Rectangular Shape */}
                  <div
                    className={`relative bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
                      hoveredProduct === `${product.id}-${currentPage}`
                        ? "border-2 border-amber-500"
                        : "border border-gray-200"
                    }`}
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Product Info - Bottom Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-semibold mb-1 text-sm text-center line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-center flex items-center gap-1 justify-center">
                        <MdOutlineCurrencyRupee className="text-base" />
                        {product.price}
                      </p>
                    </div>

                    {/* Static Action Icons for Mobile & Tablet */}
                    <div className="lg:hidden absolute top-2 right-2 flex flex-col space-y-2">
                      <button className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300">
                        <FaRegHeart className="text-xs md:text-sm" />
                      </button>
                      <button className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300">
                        <FaShoppingBag className="text-xs md:text-sm" />
                      </button>
                      <button className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300">
                        <IoMdShare className="text-xs md:text-sm" />
                      </button>
                    </div>

                    {/* Hover Overlay with Action Icons - Desktop Only */}
                    {hoveredProduct === `${product.id}-${currentPage}` && (
                      <div className="hidden lg:flex absolute inset-0 items-center justify-center bg-black bg-opacity-20">
                        <div className="flex space-x-3">
                          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 transform hover:scale-110">
                            <FaRegHeart className="text-lg" />
                          </button>
                          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 transform hover:scale-110">
                            <FaShoppingBag className="text-lg" />
                          </button>
                          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 transform hover:scale-110">
                            <IoMdShare className="text-lg" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
        }
      `}</style>
      {/* Last */}
         <div className="mb-10 relative max-w-[90%] mx-auto">
  <img
    className="h-[50vh] w-full object-cover"
    src={bottomBanner}
    alt="Categories Banner"
  />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl lg:top-1/2 lg:left-auto lg:right-3 lg:translate-x-0 p-3 sm:p-4 md:p-6">
    <div className="text-center md:text-left   p-4 sm:p-6 md:p-8">
      <p className="uppercase tracking-widest flex items-center gap-2 mb-4 sm:mb-6 justify-center md:justify-start text-white text-sm md:text-base lg:text-lg">
        Collection <RxDividerVertical className="text-white" />
      </p>
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl md:text-3xl text-white font-semibold">
          Sommelier
        </h2>
        <div className="text-white ">
          <p className="text-xs sm:text-sm leading-tight">
            Introducing our new minimalistic  collection
          </p>
          <p className="text-xs sm:text-sm leading-tight">
            Suitable for the active yet elegant
          </p>
        </div>
        <button className=" border border-white text-white px-3 py-1.5 sm:px-4 sm:py-2 text-nowrap mt-3 sm:mt-4   text-xs sm:text-sm">
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
