import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchResults from "../component/SearchResults";
import Pagination from "./Pagination";
import SidebarFilters from "./SidebarFilters";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const pageQuery = queryParams.get("page") || 1;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/searchview?search=${searchQuery}&page=${pageQuery}`,
        );
        

        // Debug the response
        console.log("Search API Response:", response.data);

        const {
          products = [],
          totalPages = 1,
          totalproduct = 0,
        } = response.data || {};

        setResults(Array.isArray(products) ? products : []);
        setTotalPages(totalPages);
        setTotalResults(totalproduct);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]); // fallback in case of error
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, pageQuery, filters]);

  const handlePageChange = (newPage) => {
    navigate(`/search?q=${searchQuery}&page=${newPage}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    navigate(`/search?q=${searchQuery}&page=1`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <SidebarFilters
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              Showing {results.length} of {totalResults} results
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              <SearchResults
                results={results}
                onResultClick={() => window.scrollTo(0, 0)}
              />
              <Pagination
                currentPage={Number(pageQuery)}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
