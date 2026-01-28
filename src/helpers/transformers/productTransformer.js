/**
 * Product Data Transformer
 * Converts backend product data structure to frontend format
 */

/**
 * Transform a single product from backend format to frontend format
 * @param {Object} backendProduct - Product object from backend API
 * @param {Object} options - Transformation options
 * @returns {Object} Transformed product object
 */
export const transformProduct = (backendProduct, options = {}) => {
    if (!backendProduct) return null;

    const {
        useFallbackImages = true,
        defaultImage = null,
        defaultAngleImage = null,
    } = options;

    // Determine the price to display
    const hasOffer = backendProduct.isOnOffer && backendProduct.offerPrice;
    const displayPrice = hasOffer ? backendProduct.offerPrice : backendProduct.sellingPrice;
    const originalPrice = hasOffer ? backendProduct.sellingPrice : null;

    // Extract images
    const images = backendProduct.images || [];
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    const secondaryImage = images[1] || images[0];

    return {
        id: backendProduct._id,
        title: backendProduct.name,
        slug: backendProduct.slug,
        sku: backendProduct.sku,

        // Pricing
        price: displayPrice,
        originalPrice: originalPrice,
        sellingPrice: backendProduct.sellingPrice,
        offerPrice: backendProduct.offerPrice,
        isOnOffer: backendProduct.isOnOffer,
        discountValue: backendProduct.discountValue,
        discountType: backendProduct.discountType,

        // Images
        image: primaryImage?.url || defaultImage,
        angleImage: secondaryImage?.url || defaultAngleImage,
        images: images.map(img => ({
            url: img.url,
            alt: img.alt || backendProduct.name,
            isPrimary: img.isPrimary || false,
        })),

        // Description
        description: backendProduct.description,
        shortDescription: backendProduct.shortDescription,

        // Rating
        rating: backendProduct.ratingAverage || 0,
        ratingCount: backendProduct.ratingCount || 0,

        // Stock
        stock: backendProduct.stock,
        inStock: backendProduct.stock > 0,
        lowStockThreshold: backendProduct.lowStockThreshold,
        isLowStock: backendProduct.stock <= backendProduct.lowStockThreshold,

        // Categories
        category: backendProduct.category,
        subCategory: backendProduct.subCategory,

        // Flags
        isFeatured: backendProduct.isFeatured,
        isBestSeller: backendProduct.isBestSeller,
        isNewArrival: backendProduct.isNewArrival,

        // Additional details
        material: backendProduct.material,
        weight: backendProduct.weight,
        dimensions: backendProduct.dimensions,
        tags: backendProduct.tags || [],
        gemstones: backendProduct.gemstones || [],

        // Metadata
        viewCount: backendProduct.viewCount,
        purchaseCount: backendProduct.purchaseCount,
        createdAt: backendProduct.createdAt,
        updatedAt: backendProduct.updatedAt,

        // Offer dates
        offerStartDate: backendProduct.offerStartDate,
        offerEndDate: backendProduct.offerEndDate,
    };
};

/**
 * Transform an array of products
 * @param {Array} backendProducts - Array of product objects from backend
 * @param {Object} options - Transformation options
 * @returns {Array} Array of transformed products
 */
export const transformProducts = (backendProducts, options = {}) => {
    if (!Array.isArray(backendProducts)) return [];

    return backendProducts
        .map(product => transformProduct(product, options))
        .filter(Boolean); // Remove any null values
};

/**
 * Transform product for cart/wishlist (minimal data)
 * @param {Object} backendProduct - Product object from backend
 * @returns {Object} Minimal product object for cart/wishlist
 */
export const transformProductMinimal = (backendProduct) => {
    if (!backendProduct) return null;

    const hasOffer = backendProduct.isOnOffer && backendProduct.offerPrice;
    const displayPrice = hasOffer ? backendProduct.offerPrice : backendProduct.sellingPrice;
    const images = backendProduct.images || [];
    const primaryImage = images.find(img => img.isPrimary) || images[0];

    return {
        id: backendProduct._id,
        title: backendProduct.name,
        slug: backendProduct.slug,
        price: displayPrice,
        originalPrice: hasOffer ? backendProduct.sellingPrice : null,
        image: primaryImage?.url,
        stock: backendProduct.stock,
        inStock: backendProduct.stock > 0,
    };
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
        return 0;
    }

    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Format price for display
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '₹') => {
    if (typeof price !== 'number') return `${currency}0`;

    return `${currency}${price.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default {
    transformProduct,
    transformProducts,
    transformProductMinimal,
    calculateDiscountPercentage,
    formatPrice,
};
