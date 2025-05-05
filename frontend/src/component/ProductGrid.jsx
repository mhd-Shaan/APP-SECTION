import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./Cartlogic";
import { useSelector } from "react-redux";

const NextArrow = ({ onClick }) => (
  <div onClick={onClick} className="z-20 absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer border border-gray-200 hover:bg-gray-50 transition-all">
    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div onClick={onClick} className="z-20 absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer border border-gray-200 hover:bg-gray-50 transition-all">
    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
  </div>
);

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cityError, setCityError] = useState(false);
  const { user } = useSelector((state) => state.user);
  const hasShownCityError = useRef(false);
  const city = user?.city;

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        params: { city },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      const is401 = error.response?.status === 401;
      if (is401 && !hasShownCityError.current) {
        setCityError(true);
        toast("Products for your city coming soon", {
          icon: "📍",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        hasShownCityError.current = true;
      } else if (!is401) {
        toast.error(error?.response?.data?.error || "Something went wrong");
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const settings = {
    dots: false,
    infinite: products.length > 4,
    speed: 600,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { 
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(products.length, 4),
        }
      },
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: Math.min(products.length, 3),
          arrows: true
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: Math.min(products.length, 2),
          arrows: true
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 1,
          arrows: true,
          centerMode: true,
          centerPadding: "20px"
        } 
      },
    ],
  };

  const renderRatingStars = (rating = 4) => {
    return Array(5).fill(null).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white relative">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <Skeleton variant="rectangular" width="100%" height={150} />
              <Skeleton height={30} />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
              <Skeleton variant="rectangular" height={36} />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="max-w-7xl mx-auto relative px-2 sm:px-">
          <Slider {...settings}>
            {products.map((item, i) => (
              <div key={i} className="px-1 sm:px-2 mb-3">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 min-h-[380px] sm:min-h-[400px] flex flex-col justify-between relative cursor-pointer" onClick={() => handleProductClick(item._id)}>
                  <div className="h-32 sm:h-40 flex justify-center items-center mb-3 sm:mb-4">
                    <img src={item.images[0] || "/placeholder-image.png"} alt={item.productName} className="object-contain h-full transform hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-1">{item.productName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">SKU#: {item.productId}</p>
                    <div className="flex justify-center text-sm sm:text-base">{renderRatingStars(item.rating)}</div>
                    {item.brand && (
                      <div className="flex justify-center">
                        <img src={item.brand.image} alt={item.brand.name} className="w-20 sm:w-24 h-8 sm:h-10 object-contain"/>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">₹{item.price}</span>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">₹{item.mrp}</span>
                      <span className="text-xs text-white bg-red-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">{item.discount}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4" onClick={(e) => e.stopPropagation()}>
                    <AddToCartButton productId={item._id} />
                    <WishlistButton productId={item._id} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : cityError ? (
        <p className="text-center text-gray-500 max-w-7xl mx-auto">This city has no products yet.</p>
      ) : (
        <p className="text-center text-gray-500 max-w-7xl mx-auto">No products available.</p>
      )}
    </section>
  );
};

export default ProductSlider;