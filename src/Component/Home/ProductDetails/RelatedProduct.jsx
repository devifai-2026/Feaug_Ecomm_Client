import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyRupee, BsStarFill } from "react-icons/bs";
import productApi from "../../../apis/productApi";
import one from "../../../assets/RelatedProduct/one.jpg";
import two from "../../../assets/RelatedProduct/two.jpg";
import three from "../../../assets/RelatedProduct/three.jpg";

const RelatedProducts = ({ productId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback products when API doesn't return data
  const fallbackProducts = [
    {
      id: "fallback-1",
      name: "Platinum Square Ring",
      originalPrice: 12999,
      discountedPrice: 8999,
      image: one,
      rating: 4.5,
      stockStatus: "in_stock",
    },
    {
      id: "fallback-2",
      name: "Platinum Rectangular Ring",
      originalPrice: 14999,
      discountedPrice: 9999,
      image: two,
      rating: 4.2,
      stockStatus: "in_stock",
    },
    {
      id: "fallback-3",
      name: "Platinum Oval Ring",
      originalPrice: 10999,
      discountedPrice: 7999,
      image: three,
      rating: 4.8,
      stockStatus: "in_stock",
    },
  ];

  useEffect(() => {
    setLoading(true);

    productApi.getAllProducts({
      params: { limit: 12 },
      setLoading,
      onSuccess: (data) => {
        const productList = data.data?.products || data.data || [];
        if (data.success && productList.length > 0) {
          const transformedProducts = productList
            .filter((p) => (p._id || p.id) !== productId)
            .slice(0, 3)
            .map((product) => ({
              id: product._id || product.id,
              name: product.name,
              originalPrice: product.sellingPrice || product.basePrice,
              discountedPrice:
                product.offerPrice || product.sellingPrice || product.basePrice,
              image: product.images?.[0]?.url || one,
              rating:
                product.ratingAverage ||
                product.ratingsAverage ||
                product.rating ||
                0,
              stockStatus:
                product.stockStatus ||
                (product.stockQuantity > 0 ? "in_stock" : "out_of_stock"),
            }));
          setProducts(
            transformedProducts.length > 0
              ? transformedProducts
              : fallbackProducts,
          );
        } else {
          setProducts(fallbackProducts);
        }
      },
      onError: (err) => {
        console.error("Error fetching products:", err);
        setProducts(fallbackProducts);
      },
    });
  }, [productId]);

  const handleProductClick = (id) => {
    if (id.startsWith("fallback-")) {
      // For fallback products, just scroll to top
      window.scrollTo(0, 0);
      return;
    }
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="max-w-[90%] mx-auto">
        <div className="mt-10 mb-10">
          <hr />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center md:text-left">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 w-full h-64 sm:h-80 md:h-[400px]"></div>
                <div className="bg-gray-200 h-6 w-3/4 mt-4 mb-2"></div>
                <div className="bg-gray-200 h-5 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[90%] mx-auto">
      <div className="mt-10 mb-10">
        <hr />
      </div>
      {/* Related Products Section */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center md:text-left">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-64 sm:h-80 md:h-[400px] object-cover transition-all duration-300 group-hover:scale-105"
                  src={product.image}
                  alt={product.name}
                />
                {product.stockStatus === "out_of_stock" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-semibold mt-4 mb-2 transition-all duration-300 group-hover:scale-105">
                {product.name}
              </h2>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <BsStarFill
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium ml-1">
                  {product.rating > 0
                    ? Number(product.rating).toFixed(1)
                    : "0.0"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.originalPrice > product.discountedPrice && (
                  <p className="text-gray-500 line-through text-sm md:text-base transition-all duration-300 group-hover:scale-105 flex items-center gap-1">
                    <BsCurrencyRupee />
                    {product.originalPrice?.toLocaleString("en-IN")}
                  </p>
                )}
                <p className="text-lg md:text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105 flex items-center gap-1">
                  <BsCurrencyRupee />
                  {product.discountedPrice?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
