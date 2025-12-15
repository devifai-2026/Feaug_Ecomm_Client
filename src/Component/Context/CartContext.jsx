import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

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

    // Load cart from localStorage on initial render
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
    const addToCart = (product, quantity = 1) => {
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            // Item already in cart - Don't add again
            return {
                success: false,
                message: 'Item already in cart',
                item: cartItems[existingItemIndex]
            };
        } else {
            // Add new item to cart
            setCartItems(prev => {
                const newItem = {
                    ...product,
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                };
                return [...prev, newItem];
            });
            
            return {
                success: true,
                message: 'Added to cart successfully'
            };
        }
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
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
    const clearCart = () => {
        setCartItems([]);
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
            getTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};