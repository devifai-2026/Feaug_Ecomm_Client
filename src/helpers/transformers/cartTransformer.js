/**
 * Cart Data Transformer
 * Converts backend cart data structure to frontend format
 */

/**
 * Transform cart item from backend format to frontend format
 * @param {Object} backendCartItem - Cart item object from backend API
 * @returns {Object} Transformed cart item object
 */
export const transformCartItem = (backendCartItem) => {
    if (!backendCartItem) return null;

    const product = backendCartItem.product || {};
    const images = product.images || [];
    const primaryImage = images.find(img => img.isPrimary) || images[0];

    const hasOffer = product.isOnOffer && product.offerPrice;
    const itemPrice = hasOffer ? product.offerPrice : product.sellingPrice;

    return {
        id: backendCartItem._id,
        itemId: backendCartItem._id,
        productId: product._id,
        title: product.name,
        slug: product.slug,
        price: itemPrice,
        originalPrice: hasOffer ? product.sellingPrice : null,
        image: primaryImage?.url,
        quantity: backendCartItem.quantity,
        variant: backendCartItem.variant,
        subtotal: backendCartItem.subtotal,
        stock: product.stock,
        inStock: product.stock > 0,
        isAvailable: product.isActive && product.stock >= backendCartItem.quantity,
    };
};

/**
 * Transform full cart from backend format to frontend format
 * @param {Object} backendCart - Cart object from backend API
 * @returns {Object} Transformed cart object
 */
export const transformCart = (backendCart) => {
    if (!backendCart) {
        return {
            items: [],
            itemCount: 0,
            subtotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            coupon: null,
        };
    }

    return {
        id: backendCart._id,
        items: (backendCart.items || []).map(transformCartItem).filter(Boolean),
        itemCount: backendCart.itemCount || 0,
        subtotal: backendCart.subtotal || 0,
        discount: backendCart.discount || 0,
        tax: backendCart.tax || 0,
        shipping: backendCart.shipping || 0,
        total: backendCart.total || 0,
        coupon: backendCart.coupon ? {
            code: backendCart.coupon.code,
            discountType: backendCart.coupon.discountType,
            discountValue: backendCart.coupon.discountValue,
            appliedDiscount: backendCart.appliedDiscount,
        } : null,
    };
};

/**
 * Calculate cart totals
 * @param {Array} items - Array of cart items
 * @param {Object} options - Calculation options
 * @returns {Object} Cart totals
 */
export const calculateCartTotals = (items, options = {}) => {
    const {
        taxRate = 0,
        shippingCost = 0,
        discountAmount = 0,
    } = options;

    const subtotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const discount = discountAmount;
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const tax = subtotalAfterDiscount * taxRate;
    const shipping = shippingCost;
    const total = subtotalAfterDiscount + tax + shipping;

    return {
        subtotal,
        discount,
        tax,
        shipping,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
};

export default {
    transformCartItem,
    transformCart,
    calculateCartTotals,
};
