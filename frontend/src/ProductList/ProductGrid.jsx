import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import WishlistButton from "@/component/WishlistButton";
import SidebarFilters from "./SidebarFilters";
import toast from "react-hot-toast";

const ProductGrid = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
    const [cityError, setCityError] = useState(false);
  const [error, setError] = useState(null);



  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const city = searchParams.get("city");

  const page = parseInt(searchParams.get("page")) || 1;

  

  

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/searchview", {
          params: { search: query, page,filters,city },
        });

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
      } catch (error) {
        const is401 = error.response?.status === 404;
        if(is401){
          setCityError(true)
        }else{
          console.error("Failed to fetch products:", error);
          setError("Failed to load products. Please try again later.");
          setProducts([]);
          setTotalPages(1); // Prevent pagination from showing if there's an error
        }    
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page,filters]);

  const handlePageChange = (newPage) => {
    const newSearch = new URLSearchParams(location.search);
    newSearch.set("page", newPage);
    navigate(`${location.pathname}?${newSearch.toString()}`);
  };

  // Memoize pagination buttons
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );


  const handlefilterchange = async(filters)=>{
    try {
      setLoading(true);
      
      // Convert filters to query parameters
      const params = new URLSearchParams();
      
      if (filters.categories?.length > 0) {
        params.append('categories', filters.categories.join(','));
      }
      
      if (filters.brands?.length > 0) {
        params.append('brands', filters.brands.join(','));
      }
      
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      const response = await axios.get(`http://localhost:5000/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-3 rounded-lg border">
              <div className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      {cityError ? (
        <p className="text-center text-gray-500 max-w-7xl mx-auto">
          This city has no products yet.
        </p>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No products found matching your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const discount =
                product.mrp > 0
                  ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                  : 0;
              const ratingCount = product.ratingCount || 0;
              const isAssured = product.isAssured || false;

              return (
                <div
                  key={product._id}
                  className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <WishlistButton productId={product._id} />
                  </div>

                  <Link to={`/product-details/${product._id}`}>
                    <div className="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center p-2">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="ml-3 font-medium text-sm line-clamp-2 text-gray-800 hover:text-blue-600 ">
                      {product.productName}
                    </h3>
                  </Link>

                  {product.brand?.image && (
                    <div className="">
                      <img
                        src={product.brand.image}
                        alt={product.brand.name || "Brand"}
                        className="w-20 h-auto object-contain"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="ml-3 flex items-center">
                      <div className="flex items-center bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded mr-1">
                        <span className="text-xs font-semibold">
                          {product.rating || "0"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-0.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({ratingCount.toLocaleString()})
                      </span>
                    </div>
                    {isAssured && (
                      <div className="flex items-center bg-blue-600 text-white px-1.5 py-0.5 rounded">
                        <span className="text-xs font-medium">Assured</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-0.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 000-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex items-baseline flex-wrap">
                      <span className="ml-3 text-lg font-bold text-gray-900">
                        ₹{product.price?.toLocaleString() || "N/A"}
                      </span>
                      {product.mrp > 0 && product.mrp > product.price && (
                        <>
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ₹{product.mrp.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-green-600 ml-2 font-medium">
                              {discount}% off
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center space-x-2">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;