import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import bannerApi from "../../apis/bannerApi";
import one from "../../assets/Categories/one.webp";

import { IoMdClose } from "react-icons/io";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { TbMinusVertical } from "react-icons/tb";
import SliderLogo from "./SliderLogo";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import toast from "react-hot-toast";
import { BsHeart, BsHeartFill, BsCurrencyRupee, BsBagPlus, BsBagCheckFill } from "react-icons/bs";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import productApi from "../../apis/productApi";
import categoryApi from "../../apis/categoryApi";

const Category = () => {
    // ---------------------------------------------------------
    // State & Context
    // ---------------------------------------------------------
    const navigate = useNavigate();
    const location = useLocation();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart, isInCart, removeFromCart } = useCart();
    const isCartActive = (pid) => isInCart(pid);

    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedMaterials, setSelectedMaterials] = useState({});
    const [selectedBrands, setSelectedBrands] = useState({});
    const [selectedSizes, setSelectedSizes] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [layout, setLayout] = useState("grid");
    const [sortBy, setSortBy] = useState("Popularity");

    const [categories, setCategories] = useState(["All Jewelry"]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [topBannerData, setTopBannerData] = useState(null);
    const [bottomBannerData, setBottomBannerData] = useState(null);

    const [activeCategoryFilter, setActiveCategoryFilter] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("category") || "";
    });

    const [searchFilter, setSearchFilter] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("search") || "";
    });

    const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
    const productsPerPage = 12;

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---------------------------------------------------------
    // Effects
    // ---------------------------------------------------------

    // Sync with URL category/search parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get("category") || "";
        const searchParam = params.get("search") || "";

        setActiveCategoryFilter(categoryParam);
        setSearchFilter(searchParam);

        if (categories.length > 1) {
            if (!categoryParam) {
                setActiveCategory(0);
            } else {
                const index = categories.findIndex(
                    (cat) => cat.toLowerCase() === categoryParam.toLowerCase(),
                );
                if (index !== -1) setActiveCategory(index);
            }
        }
    }, [location.search, categories]);

    // Initial data fetch
    useEffect(() => {
        // Banners
        const fetchBanners = async () => {
            bannerApi.getBannersByPage({
                page: "category",
                position: "top",
                onSuccess: (data) => {
                    if (data.status === "success" && data.data?.banners?.length > 0) {
                        const b = data.data.banners[0];
                        setTopBannerData({
                            image: b.images?.[0]?.url,
                            label: b.subheader || "",
                            title: b.title || "",
                            description: b.body || "",
                            buttonText: b.buttonText || "Shop Now",
                            redirectUrl: b.redirectUrl || "/categories",
                        });
                    }
                },
            });
            bannerApi.getBannersByPage({
                page: "category",
                position: "bottom",
                onSuccess: (data) => {
                    if (data.status === "success" && data.data?.banners?.length > 0) {
                        const b = data.data.banners[0];
                        setBottomBannerData({
                            image: b.images?.[0]?.url,
                            label: b.subheader || "",
                            title: b.title || "",
                            description: b.body || "",
                            buttonText: b.buttonText || "Shop Now",
                            redirectUrl: b.redirectUrl || "/categories",
                        });
                    }
                },
            });
        };

        // Categories
        categoryApi.getAdminCategories({
            setLoading: setIsCategoriesLoading,
            onSuccess: (response) => {
                if (response.success && response.data?.categories) {
                    const fetchedCategories = response.data.categories.map((cat) => cat.name);
                    setCategories(["All Jewelry", ...fetchedCategories]);
                }
            },
        });

        // Products
        productApi.getAllProducts({
            params: { limit: 1000 },
            setLoading,
            onSuccess: (response) => {
                if (response.success && response.data?.products) {
                    setAllProducts(response.data.products);
                }
            },
            onError: (err) => {
                setError("Failed to load products");
                toast.error("Failed to load products");
            }
        });

        fetchBanners();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = [...allProducts];

        if (activeCategoryFilter) {
            result = result.filter(
                (p) => p.category?.name?.toLowerCase() === activeCategoryFilter.toLowerCase() ||
                       p.subCategory?.name?.toLowerCase() === activeCategoryFilter.toLowerCase()
            );
        }

        if (searchFilter) {
            const q = searchFilter.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(q) || 
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q)
            );
        }

        result = result.filter(p => p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1]);

        const activeMaterials = Object.keys(selectedMaterials).filter(m => selectedMaterials[m]);
        if (activeMaterials.length > 0) {
            result = result.filter(p => activeMaterials.some(m => p.material?.toLowerCase().includes(m.toLowerCase())));
        }

        const activeBrands = Object.keys(selectedBrands).filter(b => selectedBrands[b]);
        if (activeBrands.length > 0) {
            result = result.filter(p => p.brand && activeBrands.some(b => b.toLowerCase() === p.brand.toLowerCase()));
        }

        if (sortBy === "Price: Low to High") result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        else if (sortBy === "Price: High to Low") result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        else if (sortBy === "Newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else result.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [allProducts, activeCategoryFilter, searchFilter, priceRange, selectedMaterials, selectedBrands, sortBy]);

    // ---------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------
    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        
        const pid = product._id;
        if (isInCart(pid)) {
            removeFromCart(pid);
            toast.success('Removed from cart');
            return;
        }

        if (product.stockQuantity === 0) {
            toast.error("Out of stock");
            return;
        }
        addToCart({
            id: pid,
            title: product.name,
            price: product.sellingPrice,
            image: product.images?.[0]?.url || one,
        }, 1);
        toast.success(`${product.name} added to cart`);
    };

    const handleWishlistToggle = (product, e) => {
        e.stopPropagation();
        const pid = product._id;
        if (isInWishlist(pid)) {
            removeFromWishlist(pid);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                id: pid,
                title: product.name,
                price: product.sellingPrice,
                image: product.images?.[0]?.url || one,
            });
            toast.success("Added to wishlist");
        }
    };

    const materials = useMemo(() => {
        const mats = ["Gold", "Silver", "Platinum", "Diamond", "Pearl", "Gemstone"];
        return mats.map(m => ({
            name: m,
            count: allProducts.filter(p => p.material?.toLowerCase().includes(m.toLowerCase())).length
        }));
    }, [allProducts]);

    const brandsList = useMemo(() => {
        const brs = ["Rollage", "HELEN & JAMES", "ORE Jewelry", "Platinum Elite", "Silver Dreams"];
        return brs.map(b => ({
            name: b,
            count: allProducts.filter(p => p.brand?.toLowerCase() === b.toLowerCase()).length
        }));
    }, [allProducts]);

    // ---------------------------------------------------------
    // Sub-components (defined inside but properly to avoid reset)
    // Actually best to inline them or define as plain functions to avoid type-change re-mounts
    // ---------------------------------------------------------
    
    const renderSidebar = () => (
        <div className="space-y-10 pr-4">
            {/* Categories */}
            <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Collections</h3>
                <ul className="space-y-3">
                    {categories.map((cat, i) => (
                        <li key={i} className="relative">
                            <button
                                onClick={() => {
                                    if (cat === "All Jewelry") navigate("/categories", { replace: true });
                                    else navigate(`/categories?category=${encodeURIComponent(cat)}`, { replace: true });
                                }}
                                className={`text-[14px] font-bold uppercase tracking-widest transition-all duration-500 ease-out flex items-center ${
                                    i === activeCategory 
                                        ? 'text-[#C19A6B] translate-x-3' 
                                        : 'text-gray-400 hover:text-black hover:translate-x-1'
                                }`}
                            >
                                {i === activeCategory && (
                                    <TbMinusVertical className="absolute -left-5 text-lg font-bold" />
                                )}
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Slider - Dual Range Fix */}
            <div>
                <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Price Range</h3>
                <div className="space-y-6">
                    <div className="flex justify-between text-[14px] font-bold text-gray-900 border-b border-gray-100 pb-1">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                        <div className="absolute w-full h-1 bg-gray-100 rounded-full"></div>
                        <div 
                            className="absolute h-1 bg-[#C19A6B] rounded-full"
                            style={{
                                left: `${(priceRange[0] / 100000) * 100}%`,
                                right: `${100 - (priceRange[1] / 100000) * 100}%`
                            }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={priceRange[0]}
                            onChange={(e) => {
                                const val = Math.min(parseInt(e.target.value), priceRange[1] - 1000);
                                setPriceRange([val, priceRange[1]]);
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 h-1 filter-range"
                        />
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={priceRange[1]}
                            onChange={(e) => {
                                const val = Math.max(parseInt(e.target.value), priceRange[0] + 1000);
                                setPriceRange([priceRange[0], val]);
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 h-1 filter-range"
                        />
                    </div>
                   
                </div>
            </div>

            {/* Materials */}
            <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Material</h3>
                <div className="space-y-3">
                    {materials.map((m, i) => (
                        <label key={i} className="flex items-center group cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedMaterials[m.name] || false}
                                onChange={() => setSelectedMaterials(prev => ({ ...prev, [m.name]: !prev[m.name] }))}
                                className="hidden"
                            />
                            <div className={`w-4 h-4 border flex items-center justify-center mr-3 transition-all ${selectedMaterials[m.name] ? 'bg-black border-black' : 'border-gray-200 group-hover:border-black'}`}>
                                {selectedMaterials[m.name] && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-xs font-medium uppercase tracking-widest ${selectedMaterials[m.name] ? 'text-black' : 'text-gray-500'}`}>{m.name}</span>
                            <span className="ml-auto text-[10px] text-gray-300">({m.count})</span>
                        </label>
                    ))}
                </div>
            </div>

             {/* Brands */}
             <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Brands</h3>
                <div className="space-y-3">
                    {brandsList.map((b, i) => (
                        <label key={i} className="flex items-center group cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedBrands[b.name] || false}
                                onChange={() => setSelectedBrands(prev => ({ ...prev, [b.name]: !prev[b.name] }))}
                                className="hidden"
                            />
                            <div className={`w-4 h-4 border flex items-center justify-center mr-3 transition-all ${selectedBrands[b.name] ? 'bg-black border-black' : 'border-gray-200 group-hover:border-black'}`}>
                                {selectedBrands[b.name] && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-xs font-medium uppercase tracking-widest ${selectedBrands[b.name] ? 'text-black' : 'text-gray-500'}`}>{b.name}</span>
                            <span className="ml-auto text-[10px] text-gray-300">({b.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => {
                    setSelectedMaterials({});
                    setSelectedBrands({});
                    setPriceRange([0, 100000]);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-red-500 pt-6 border-t border-gray-50 flex items-center gap-2"
            >
                Clear All Selections
            </button>
        </div>
    );

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    return (
        <div className="min-h-screen bg-white">
            <style>{`
                .filter-range::-webkit-slider-thumb {
                    pointer-events: auto;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #fff;
                    border: 2px solid #C19A6B;
                    cursor: pointer;
                    appearance: none;
                    transition: border-color 0.3s;
                }
                .filter-range::-webkit-slider-thumb:hover {
                    border-color: #000;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>

            <div className="max-w-[90%] mx-auto py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <nav className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C19A6B] mb-6 flex items-center gap-4">
                            <span className="text-gray-900">Collections</span>
                        </nav>
                        <h1 className="text-4xl md:text-7xl font-light tracking-tighter text-gray-900">
                            Curated <span className="italic text-[#C19A6B]">Selection</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-6">
                            Showing {filteredProducts.length} unique masterpieces
                        </p>
                    </div>

                    {/* Desktop Pill Bar */}
                    <div className="hidden md:flex items-center gap-6 p-1 bg-gray-50 rounded-full border border-gray-100 flex-nowrap">
                        {["Popularity", "Price: Low to High", "Price: High to Low", "Newest"].map((sort) => (
                            <button
                                key={sort}
                                onClick={() => setSortBy(sort)}
                                className={`px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${
                                    sortBy === sort ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {sort}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="md:hidden w-full max-w-[200px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 p-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none rounded-2xl"
                        >
                            <option value="Popularity">By Popularity</option>
                            <option value="Price: Low to High">Price: Low to High</option>
                            <option value="Price: High to Low">Price: High to Low</option>
                            <option value="Newest">Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filter - Fixed the scroll behavior by inlining structure or moving outside */}
                    <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24 max-h-[80vh] overflow-y-auto scrollbar-hide">
                            {renderSidebar()}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="animate-pulse space-y-4">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-3xl" />
                                        <div className="h-4 bg-gray-50 w-3/4" />
                                        <div className="h-4 bg-gray-50 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : currentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 border border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30">
                                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C19A6B] mb-4 text-center px-6">
                                    No Masterpieces Available
                                </p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    In this specific selection
                                </p>
                                <button 
                                    onClick={() => {
                                        setSelectedMaterials({});
                                        setSelectedBrands({});
                                        setPriceRange([0, 100000]);
                                        navigate("/categories", { replace: true });
                                    }}
                                    className="mt-12 px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-[#C19A6B] transition-all"
                                >
                                    Explore All Collections
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                                {currentProducts.map((product) => (
                                    <div 
                                        key={product._id} 
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-[2rem] border border-gray-100 mb-6 transition-all duration-700 group-hover:border-[#C19A6B]/30 group-hover:shadow-2xl group-hover:shadow-[#C19A6B]/5">
                                            <img 
                                                src={product.images?.[0]?.url || one} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {/* Action Bar (Top Right) */}
                                            <div className="absolute top-3 right-3 md:top-6 md:right-6 flex flex-col gap-2 md:gap-3 z-30 transition-all duration-500 lg:translate-x-12 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 opacity-100 translate-x-0">
                                                <button 
                                                    onClick={(e) => handleWishlistToggle(product, e)}
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white shadow-xl transition-colors ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400 hover:text-[#C19A6B]'}`}
                                                >
                                                    {isInWishlist(product._id) ? <BsHeartFill className="text-xs md:text-sm" /> : <BsHeart className="text-xs md:text-sm" />}
                                                </button>
                                                <button 
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white transition-all rounded-full shadow-xl ${isCartActive(product._id) ? 'text-[#C19A6B]' : 'text-gray-400 hover:text-[#C19A6B]'}`}
                                                >
                                                    {isCartActive(product._id) ? <BsBagCheckFill className="text-sm md:text-lg" /> : <BsBagPlus className="text-sm md:text-lg" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{product.name}</h3>
                                                <span className="text-xs font-bold text-[#C19A6B]">₹{product.sellingPrice.toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{product.material} • {product.brand}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-32 flex items-center justify-center gap-12">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-4 rounded-full border border-gray-100 transition-all disabled:opacity-30 hover:border-black"
                                >
                                    <FaChevronLeft className="text-xs" />
                                </button>
                                <div className="flex items-center gap-6">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'text-[#C19A6B] scale-150' : 'text-gray-300 hover:text-black'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-4 rounded-full border border-gray-100 transition-all disabled:opacity-30 hover:border-black"
                                >
                                    <FaChevronRight className="text-xs" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
                 <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-700 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-8 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-900 underline underline-offset-8">Refine Selection</h2>
                            <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900"><IoMdClose /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-hide pb-12">
                            {renderSidebar()}
                        </div>
                    </div>
                 </div>
            </div>

            {/* Mobile Filter Button */}
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-2xl flex items-center gap-4 transition-all active:scale-95"
            >
                <FaFilter className="text-xs" /> Filter Atelier
            </button>

            <SliderLogo />
        </div>
    );
};

export default Category;