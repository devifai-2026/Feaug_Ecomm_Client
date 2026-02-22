import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiLindenLeaf } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";
import { RxDividerVertical } from "react-icons/rx";
import bannerApi from "../../apis/bannerApi";

// Fallback static assets (used when no API data)
import fallbackBanner from "../../assets/cleopatra/freepik__design-editorial-soft-studio-light-photography-hig__70850.png";
import fallbackOne from "../../assets/cleopatra/one.png";
import fallbackTwo from "../../assets/cleopatra/two.png";

const CleopatraGlam = () => {
  const navigate = useNavigate();
  const [heroBanner, setHeroBanner] = useState(null);
  const [promoBanners, setPromoBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      // Fetch hero banner and promotional banners in parallel
      await Promise.all([
        bannerApi.getBannersByPage({
          page: "home",
          bannerType: "hero",
          setLoading: () => {},
          onSuccess: (data) => {
            if (data.status === "success" && data.data?.banners?.length > 0) {
              setHeroBanner(data.data.banners[0]);
            }
          },
          onError: () => {},
        }),
        bannerApi.getBannersByPage({
          page: "home",
          bannerType: "promotional",
          setLoading: () => {},
          onSuccess: (data) => {
            if (data.status === "success" && data.data?.banners?.length > 0) {
              setPromoBanners(data.data.banners.slice(0, 2));
            }
          },
          onError: () => {},
        }),
      ]);
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (banner) => {
    if (!banner?.redirectUrl) return;
    let url = banner.redirectUrl;
    if (banner.promoCode) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}promo=${banner.promoCode}`;
    }
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      navigate(url);
    }
  };

  // Fallback data for hero banner
  const heroData = heroBanner
    ? {
        image: heroBanner.images?.[0]?.url || fallbackBanner,
        label: heroBanner.subheader || "Collection",
        title: heroBanner.title || "Featured Collection",
        description: heroBanner.body || "",
        buttonText: heroBanner.buttonText || "SHOP NOW",
        redirectUrl: heroBanner.redirectUrl,
      }
    : {
        image: fallbackBanner,
        label: "Collection",
        title: "Cleopatra Glam",
        description:
          "Introducing our new mesmerizing jewellery collection.Embarace your inner allure with the timeless elegance and radiant beauty of ancient Egypt, now available exclusive on AXELS jewelry",
        buttonText: "SHOP NOW",
        redirectUrl: "/categories",
      };

  // Fallback data for promotional cards
  const defaultPromos = [
    {
      title: "Luxe Abundance",
      subheader: "Get 20% off with our code: LUX20",
      buttonText: "Redeem Code",
      images: [{ url: fallbackOne }],
      backgroundColor: "#e2e8f0",
      redirectUrl: "/cart",
    },
    {
      title: "Sparkle in Love",
      subheader: "Get 50% off on rings",
      buttonText: "View Products",
      images: [{ url: fallbackTwo }],
      backgroundColor: "#FAF9F7",
      redirectUrl: "/categories",
    },
  ];

  const promoData =
    promoBanners.length > 0
      ? promoBanners.map((b, i) => ({
          title: b.title || defaultPromos[i]?.title || "Promo",
          subheader:
            b.promoCode && b.discountPercentage
              ? `Get ${b.discountPercentage}% off with our code: ${b.promoCode}`
              : b.subheader || defaultPromos[i]?.subheader || "",
          buttonText: b.buttonText || defaultPromos[i]?.buttonText || "Shop Now",
          image: b.images?.[0]?.url || defaultPromos[i]?.images?.[0]?.url,
          backgroundColor:
            b.backgroundColor || defaultPromos[i]?.backgroundColor || "#f3f4f6",
          redirectUrl: b.redirectUrl,
          promoCode: b.promoCode,
          banner: b,
        }))
      : defaultPromos.map((p) => ({
          ...p,
          image: p.images[0].url,
          banner: null,
        }));

  if (loading) {
    return (
      <div className="max-w-[90%] mx-auto mt-8 md:mt-16 animate-pulse">
        <div className="bg-gray-200 h-[40vh] md:h-[50vh] lg:h-[60vh] rounded" />
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-6">
          <div className="flex-1 bg-gray-200 h-24 md:h-32 rounded" />
          <div className="flex-1 bg-gray-200 h-24 md:h-32 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90%] mx-auto mt-8 md:mt-16">
      {/* Banner Section */}
      <div
        className={`relative group overflow-hidden ${heroData.redirectUrl ? "cursor-pointer" : ""}`}
        onClick={() => heroBanner && handleBannerClick(heroBanner)}
      >
        <img
          className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] object-cover transition-transform duration-500 group-hover:scale-105 opacity-40 md:opacity-70 lg:opacity-100"
          src={heroData.image}
          alt={heroData.title}
        />
        <div className="space-y-2 md:space-y-6 max-w-[230px] md:max-w-xs lg:max-w-md absolute right-2 md:right-5 top-1/2 transform -translate-y-1/2 md:p-0 text-right md:text-right lg:text-left">
          <p className="text-gray-700 text-sm md:text-base flex items-center gap-2 justify-end lg:justify-start">
            {heroData.label} <RxDividerVertical />
          </p>
          <div className="flex justify-end lg:justify-start">
            <GiLindenLeaf className="text-2xl md:text-3xl lg:text-4xl" />
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl">{heroData.title}</h2>
          {heroData.description && (
            <p className="text-gray-900 text-xs md:text-sm lg:text-base">
              {heroData.description}
            </p>
          )}
          <button
            className="border-black border-2 px-2 py-1 md:px-3 md:py-2 bg-transparent text-sm md:text-base w-[40%] text-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              if (heroBanner) {
                handleBannerClick(heroBanner);
              } else {
                navigate("/categories");
              }
            }}
          >
            {heroData.buttonText}
          </button>
        </div>
      </div>

      {/* Promotional Cards Section */}
      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-6">
        {promoData.map((promo, index) => (
          <div
            key={index}
            className={`flex items-center justify-around w-full md:flex-1 py-2 md:py-5 lg:py-3 px-4 md:px-0 ${promo.redirectUrl ? "cursor-pointer" : ""}`}
            style={{ backgroundColor: promo.backgroundColor }}
            onClick={() => {
              if (promo.banner) {
                handleBannerClick(promo.banner);
              } else if (promo.redirectUrl) {
                navigate(promo.redirectUrl);
              }
            }}
          >
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-xl md:text-4xl lg:text-4xl text-nowrap mr-2 md:mr-0 transition-transform duration-300 hover:scale-105">
                {promo.title}
              </h1>
              <p className="text-gray-500 text-xs md:text-base lg:text-sm transition-opacity duration-300 hover:opacity-80">
                {promo.subheader}
              </p>
              <p className="mt-3 md:mt-5 flex items-center gap-2 md:gap-3 text-sm md:text-base transition-transform duration-300 hover:translate-x-1">
                {promo.buttonText}
                <FaArrowRightLong className="text-amber-950 transition-transform duration-300 hover:translate-x-1" />
              </p>
            </div>
            {promo.image && (
              <img
                src={promo.image}
                className="w-16 h-16 md:w-24 md:h-24 lg:w-56 lg:h-40"
                alt={promo.title}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleopatraGlam;
