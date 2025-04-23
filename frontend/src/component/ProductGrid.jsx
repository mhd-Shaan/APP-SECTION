import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WishlistButton from "./WishlistButton";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 rounded-full p-3 cursor-pointer shadow-md transition-all"
    onClick={onClick}
  >
    ▶
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 rounded-full p-3 cursor-pointer shadow-md transition-all"
    onClick={onClick}
  >
    ◀
  </div>
);

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/addcart",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    }
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
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const renderRatingStars = (rating = 4) => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ));
  };

  return (
    <section className="py-12 px-6 bg-[#f4f7fe] relative">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Featured Spare Parts</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md">
              <Skeleton variant="rectangular" width="100%" height={150} />
              <Skeleton height={30} />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
              <Skeleton variant="rectangular" height={36} />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <Slider {...settings}>
          {products.map((item, i) => (
            <div key={i} className="px-4">
              <div
                onClick={() => navigate(`/product/${item._id}`, { state: { product: item } })}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 p-6 min-h-[420px] flex flex-col justify-between relative cursor-pointer"
              >
                <div className="h-40 flex justify-center items-center mb-4">
                  <img
                    src={item.images || "/placeholder-image.png"}
                    alt={item.productName}
                    className="object-contain h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-base font-semibold text-gray-800 text-center line-clamp-1">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 text-center mt-1">SKU#: {item.productId}</p>

                <div className="flex justify-center mt-1">{renderRatingStars(item.rating)}</div>

                <div className="flex items-center justify-center mt-2 gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/18/TVS_logo.svg"
                    alt={item.spareBrand}
                    className="w-6 h-6"
                  />
                  <span className="text-sm text-yellow-700 font-medium">{item.spareBrand}</span>
                </div>

                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-xl font-bold text-blue-800">₹{item.price}</span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{(item.price * 1.175).toFixed(2)}
                  </span>
                  <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded">-15%</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item._id);
                    }}
                    className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition w-full"
                  >
                    ADD TO CART
                  </button>
                  <WishlistButton productId={item._id} />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">No products available</p>
      )}
    </section>
  );
};

export default ProductSlider;
