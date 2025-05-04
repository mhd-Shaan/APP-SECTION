import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { useNavigate } from "react-router-dom";

const PartsCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null); // Track selected subcategory
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]); // State to store products of the selected subcategory
  const navigate = useNavigate()

  // Fetch categories and auto-select first category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category");
        const fetchedCategories = response.data.category || [];
        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0) {
          const firstCategoryId = fetchedCategories[0]._id;
          setSelectedCategoryId(firstCategoryId);
          fetchSubCategories(firstCategoryId);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for selected category
  const fetchSubCategories = async (categoryId, page = 1) => {
    try {
      const response = await axios.get(`http://localhost:5000/subcategory/${categoryId}`, {
        params: { page, limit: 10 },
      });

      setSubCategories(response.data.subCategories || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch products for selected subcategory
  // const fetchProductsForSubCategory = async (subcategoryId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/products`, {
  //       params: { subcategoryId },
  //     });
  //     setProducts(response.data.products || []);
  //   } catch (error) {
  //     console.error("Error fetching products for subcategory:", error);
  //   }
  // };

  // When category button is clicked
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null); // Reset selected subcategory
    setProducts([]); // Clear previously fetched products
    setCurrentPage(1);
    fetchSubCategories(categoryId, 1);
  };

  // When subcategory is clicked
  const handleSubCategoryClick = (subcategoryId) => {
    
    navigate(`/search?c=${subcategoryId}`);

    // setSelectedSubCategoryId(subcategoryId);
    // fetchProductsForSubCategory(subcategoryId); // Fetch products for selected subcategory
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* CATEGORY SECTION */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            SEARCH BY <span className="font-bold text-teal-700">CATEGORY</span>
          </h2>
          <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition">
            View All <span className="ml-1 font-bold">{categories.length}</span>
          </button>
        </div>

        <Swiper
          modules={[FreeMode, Mousewheel]}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          grabCursor={true}
          mousewheel={{ forceToAxis: true }}
          className="mb-8"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id} style={{ width: "auto" }} className="!w-fit">
              <button
                onClick={() => handleCategoryClick(cat._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition whitespace-nowrap ${
                  selectedCategoryId === cat._id
                    ? "bg-blue-700 text-white"
                    : "bg-blue-50 text-gray-800 hover:bg-blue-100"
                }`}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* SUBCATEGORY SECTION */}
      {selectedCategoryId && subCategories.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">SUBCATEGORIES</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
              >
                {sub.image && (
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-14 h-14 object-contain mb-2"
                  />
                )}
                <span
                  className="text-sm font-medium cursor-pointer"
                  onClick={() => handleSubCategoryClick(sub._id)} // Handle subcategory click
                >
                  {sub.name}
                </span>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchSubCategories(selectedCategoryId, newPage);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700 font-semibold text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchSubCategories(selectedCategoryId, newPage);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* IF NO SUBCATEGORIES */}
      {selectedCategoryId && subCategories.length === 0 && (
        <div className="text-center text-gray-400 mt-10 font-medium text-lg">
          🚧 Subcategories coming soon...
        </div>
      )}

      {/* PRODUCTS SECTION */}
      {selectedSubCategoryId && products.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">PRODUCTS</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-contain mb-2"
                  />
                )}
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-xs text-gray-600">{product.price}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IF NO PRODUCTS FOR SELECTED SUBCATEGORY */}
      {selectedSubCategoryId && products.length === 0 && (
        <div className="text-center text-gray-400 mt-10 font-medium text-lg">
          🚧 No products available for this subcategory...
        </div>
      )}
    </div>
  );
};

export default PartsCategory;
