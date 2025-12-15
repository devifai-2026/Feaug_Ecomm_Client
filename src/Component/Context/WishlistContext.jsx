import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load wishlist from localStorage on initial render
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Error parsing wishlist from localStorage:', error);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isInitialized]);

    // Listen for localStorage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'wishlist') {
                try {
                    const newWishlist = e.newValue ? JSON.parse(e.newValue) : [];
                    setWishlistItems(newWishlist);
                } catch (error) {
                    console.error('Error parsing wishlist from storage event:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Add item to wishlist
    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            const isAlreadyInWishlist = prev.some(item => item.id === product.id);
            
            if (isAlreadyInWishlist) {
                return prev;
            }
            
            const newWishlist = [...prev, product];
            return newWishlist;
        });
    };

    // Remove item from wishlist
    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => {
            const newWishlist = prev.filter(item => item.id !== productId);
            return newWishlist;
        });
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    // Clear all wishlist items
    const clearWishlist = () => {
        setWishlistItems([]);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};