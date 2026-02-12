/**
 * Order Data Transformer
 * Converts backend order data structure to frontend format
 */

/**
 * Transform order item from backend format to frontend format
 * @param {Object} backendOrderItem - Order item object from backend API
 * @returns {Object} Transformed order item object
 */
export const transformOrderItem = (backendOrderItem) => {
    if (!backendOrderItem) return null;

    const product = backendOrderItem.product || {};
    const images = product.images || [];
    const primaryImage = images.find(img => img.isPrimary) || images[0];

    return {
        id: backendOrderItem._id,
        productId: product._id,
        title: product.name || backendOrderItem.name,
        slug: product.slug,
        image: primaryImage?.url || backendOrderItem.image,
        price: backendOrderItem.price,
        quantity: backendOrderItem.quantity,
        variant: backendOrderItem.variant,
        subtotal: backendOrderItem.subtotal,
        sku: backendOrderItem.sku,
    };
};

/**
 * Transform order from backend format to frontend format
 * @param {Object} backendOrder - Order object from backend API
 * @returns {Object} Transformed order object
 */
export const transformOrder = (backendOrder) => {
    if (!backendOrder) return null;

    return {
        id: backendOrder._id,
        orderNumber: backendOrder.orderNumber,

        // Items
        items: (backendOrder.items || []).map(transformOrderItem).filter(Boolean),
        itemCount: backendOrder.items?.length || 0,

        // Pricing
        subtotal: backendOrder.subtotal,
        discount: backendOrder.discount,
        tax: backendOrder.tax,
        shipping: backendOrder.shipping,
        total: backendOrder.total,

        // Status
        status: backendOrder.status,
        paymentStatus: backendOrder.paymentStatus,

        // Shipping
        shippingAddress: backendOrder.shippingAddress,
        billingAddress: backendOrder.billingAddress,
        trackingNumber: backendOrder.trackingNumber,
        carrier: backendOrder.carrier,

        // Payment
        paymentMethod: backendOrder.paymentMethod,
        paymentId: backendOrder.paymentId,

        // Dates
        orderDate: backendOrder.createdAt,
        estimatedDelivery: backendOrder.estimatedDelivery,
        deliveredAt: backendOrder.deliveredAt,

        // Additional
        notes: backendOrder.notes,
        coupon: backendOrder.coupon,

        // Metadata
        createdAt: backendOrder.createdAt,
        updatedAt: backendOrder.updatedAt,
    };
};

/**
 * Transform array of orders
 * @param {Array} backendOrders - Array of order objects from backend
 * @returns {Array} Array of transformed orders
 */
export const transformOrders = (backendOrders) => {
    if (!Array.isArray(backendOrders)) return [];

    return backendOrders
        .map(order => transformOrder(order))
        .filter(Boolean);
};

/**
 * Get order status display info
 * @param {string} status - Order status
 * @returns {Object} Status display information
 */
export const getOrderStatusInfo = (status) => {
    const statusMap = {
        pending: {
            label: 'Pending',
            color: 'yellow',
            icon: 'clock',
            description: 'Order is being processed',
        },
        confirmed: {
            label: 'Confirmed',
            color: 'blue',
            icon: 'check-circle',
            description: 'Order has been confirmed',
        },
        processing: {
            label: 'Processing',
            color: 'blue',
            icon: 'cog',
            description: 'Order is being prepared',
        },
        shipped: {
            label: 'Shipped',
            color: 'purple',
            icon: 'truck',
            description: 'Order has been shipped',
        },
        delivered: {
            label: 'Delivered',
            color: 'green',
            icon: 'check',
            description: 'Order has been delivered',
        },
        cancelled: {
            label: 'Cancelled',
            color: 'red',
            icon: 'x-circle',
            description: 'Order has been cancelled',
        },
        refunded: {
            label: 'Refunded',
            color: 'gray',
            icon: 'arrow-left',
            description: 'Order has been refunded',
        },
    };

    return statusMap[status] || {
        label: status,
        color: 'gray',
        icon: 'info',
        description: 'Unknown status',
    };
};

/**
 * Get payment status display info
 * @param {string} paymentStatus - Payment status
 * @returns {Object} Payment status display information
 */
export const getPaymentStatusInfo = (paymentStatus) => {
    const statusMap = {
        pending: {
            label: 'Pending',
            color: 'yellow',
            description: 'Payment is pending',
        },
        paid: {
            label: 'Paid',
            color: 'green',
            description: 'Payment completed',
        },
        failed: {
            label: 'Failed',
            color: 'red',
            description: 'Payment failed',
        },
        refunded: {
            label: 'Refunded',
            color: 'gray',
            description: 'Payment refunded',
        },
    };

    return statusMap[paymentStatus] || {
        label: paymentStatus,
        color: 'gray',
        description: 'Unknown payment status',
    };
};

export default {
    transformOrderItem,
    transformOrder,
    transformOrders,
    getOrderStatusInfo,
    getPaymentStatusInfo,
};
