import React, { createContext, useState, useContext, useEffect } from 'react';
import cartApi from '../../apis/cartApi';

const CartContext = createContext();

// Helper to check if user is logged in
const isUserLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch cart from API if user is logged in
    const fetchCartFromApi = async () => {
        if (!isUserLoggedIn()) return;

        setIsSyncing(true);
        await cartApi.getCart({
            setLoading: setIsSyncing,
            onSuccess: (data) => {
                if (data.success && data.data?.items) {
                    const apiCartItems = data.data.items.map(item => ({
                        id: item.product?._id || item.productId,
                        title: item.product?.name || item.name,
                        price: item.price || item.product?.sellingPrice,
                        image: item.product?.images?.[0]?.url || item.image,
                        quantity: item.quantity,
                        variant: item.variant,
                        stockQuantity: item.product?.stockQuantity || 0,
                        addedAt: item.addedAt || new Date().toISOString(),
                    }));
                    setCartItems(apiCartItems);
                    localStorage.setItem('cart', JSON.stringify(apiCartItems));
                }
            },
            onError: (err) => {
                console.error('Error fetching cart from API:', err);
                // Fall back to localStorage
            },
        });
    };

    // Load cart from localStorage on initial render, then try API
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                setCartItems([]);
            }
        }
        setIsInitialized(true);

        // If user is logged in, sync with API
        if (isUserLoggedIn()) {
            fetchCartFromApi();
        }
    }, []);

    // Listen for login status changes
    useEffect(() => {
        const handleLoginChange = () => {
            if (isUserLoggedIn()) {
                fetchCartFromApi();
            }
        };

        window.addEventListener('userLoginStatusChanged', handleLoginChange);
        return () => window.removeEventListener('userLoginStatusChanged', handleLoginChange);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(cartItems));

            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }, [cartItems, isInitialized]);

    // Listen for localStorage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'cart') {
                try {
                    const newCart = e.newValue ? JSON.parse(e.newValue) : [];
                    setCartItems(newCart);
                } catch (error) {
                    console.error('Error parsing cart from storage event:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Add item to cart - Check if already exists
    const addToCart = async (product, quantity = 1) => {
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            // Item already in cart - Don't add again
            return {
                success: false,
                message: 'Item already in cart',
                item: cartItems[existingItemIndex]
            };
        }

        // Add new item to local state
        const newItem = {
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        };

        setCartItems(prev => [...prev, newItem]);

        // Sync with API if user is logged in
        if (isUserLoggedIn()) {
            await cartApi.addToCart({
                productId: product.id,
                quantity,
                variant: product.variant,
                onError: (err) => {
                    console.error('Error syncing cart with API:', err);
                },
            });
        }

        return {
            success: true,
            message: 'Added to cart successfully'
        };
    };

    // Remove item from cart
    const removeFromCart = async (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));

        // Sync with API if user is logged in
        if (isUserLoggedIn()) {
            await cartApi.removeCartItem({
                itemId: productId,
                onError: (err) => {
                    console.error('Error removing item from API cart:', err);
                },
            });
        }
    };

    // Update item quantity
    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );

        // Sync with API if user is logged in
        if (isUserLoggedIn()) {
            await cartApi.updateCartItem({
                itemId: productId,
                quantity,
                onError: (err) => {
                    console.error('Error updating cart item in API:', err);
                },
            });
        }
    };

    // Increase quantity by 1
    const increaseQuantity = (productId) => {
        updateQuantity(productId,
            (cartItems.find(item => item.id === productId)?.quantity || 0) + 1
        );
    };

    // Decrease quantity by 1
    const decreaseQuantity = (productId) => {
        const currentItem = cartItems.find(item => item.id === productId);
        if (currentItem) {
            updateQuantity(productId, currentItem.quantity - 1);
        }
    };

    // Check if item is in cart
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    // Get item quantity
    const getItemQuantity = (productId) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    // Clear all cart items
    const clearCart = async () => {
        setCartItems([]);

        // Sync with API if user is logged in
        if (isUserLoggedIn()) {
            await cartApi.clearCart({
                onError: (err) => {
                    console.error('Error clearing cart in API:', err);
                },
            });
        }
    };

    // Calculate total items in cart
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculate total unique items in cart
    const getTotalUniqueItems = () => {
        return cartItems.length;
    };

    // Calculate subtotal
    const getSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    // Calculate total with shipping and tax
    const getTotal = (shipping = 0, taxRate = 0.18) => {
        const subtotal = getSubtotal();
        const tax = subtotal * taxRate;
        return subtotal + shipping + tax;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            increaseQuantity,
            decreaseQuantity,
            isInCart,
            getItemQuantity,
            clearCart,
            getTotalItems,
            getTotalUniqueItems,
            getSubtotal,
            getTotal,
            isSyncing,
            fetchCartFromApi,
        }}>
            {children}
        </CartContext.Provider>
    );
};