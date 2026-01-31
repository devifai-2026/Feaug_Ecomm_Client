import React, { createContext, useState, useContext, useEffect } from "react";
import wishlistApi from "../../apis/wishlistApi";

const WishlistContext = createContext();

// Helper to check if user is logged in
const isUserLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch wishlist from API if user is logged in
  const fetchWishlistFromApi = async () => {
    setIsSyncing(true);
    await wishlistApi.getWishlist({
      setLoading: setIsSyncing,
      onSuccess: (data) => {
        if (data.success && data.data?.wishlist?.items) {
          const apiWishlistItems = data.data.wishlist.items.map((item) => ({
            id: item.product?._id || item.productId,
            title: item.product?.name || item.name,
            price: item.product?.sellingPrice || item.price,
            originalPrice: item.product?.price || item.originalPrice,
            image: item.product?.images?.[0]?.url || item.image,
            angleImage: item.product?.images?.[1]?.url || item.angleImage,
            description: item.product?.description || item.description,
            rating: item.product?.rating || item.rating,
            inStock: item.product?.stock > 0,
            addedAt: item.addedAt || new Date().toISOString(),
          }));
          setWishlistItems(apiWishlistItems);
        }
      },
      onError: (err) => {
        console.error("Error fetching wishlist from API:", err);
      },
    });
  };

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
    setIsInitialized(true);

    // Sync with API
    fetchWishlistFromApi();
  }, []);

  // Listen for login status changes
  useEffect(() => {
    const handleLoginChange = () => {
      fetchWishlistFromApi();
    };

    window.addEventListener("userLoginStatusChanged", handleLoginChange);
    return () =>
      window.removeEventListener("userLoginStatusChanged", handleLoginChange);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "wishlist") {
        try {
          const newWishlist = e.newValue ? JSON.parse(e.newValue) : [];
          setWishlistItems(newWishlist);
        } catch (error) {
          console.error("Error parsing wishlist from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    const isAlreadyInWishlist = wishlistItems.some(
      (item) => item.id === product.id,
    );

    if (isAlreadyInWishlist) {
      return { success: false, message: "Already in wishlist" };
    }

    // Sync with API
    await wishlistApi.addToWishlist({
      productId: product.id,
      onSuccess: () => fetchWishlistFromApi(),
      onError: (err) => {
        console.error("Error syncing wishlist with API:", err);
        fetchWishlistFromApi();
      },
    });

    return { success: true, message: "Added to wishlist" };
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    // Sync with API
    await wishlistApi.removeFromWishlist({
      productId,
      onSuccess: () => fetchWishlistFromApi(),
      onError: (err) => {
        console.error("Error removing item from API wishlist:", err);
        fetchWishlistFromApi();
      },
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Clear all wishlist items
  const clearWishlist = async () => {
    setWishlistItems([]);

    // Sync with API
    await wishlistApi.clearWishlist({
      onError: (err) => {
        console.error("Error clearing wishlist in API:", err);
      },
    });
  };

  // Move item from wishlist to cart
  const moveToCart = async (productId) => {
    await wishlistApi.moveToCart({
      productId,
      onSuccess: () => {
        setWishlistItems((prev) =>
          prev.filter((item) => item.id !== productId),
        );
      },
      onError: (err) => {
        console.error("Error moving item to cart:", err);
      },
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        moveToCart,
        isSyncing,
        fetchWishlistFromApi,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
