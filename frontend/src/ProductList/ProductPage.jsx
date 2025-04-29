// src/pages/SearchPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarFilters from "./SidebarFilters";
import ProductGrid from "./ProductGrid";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";

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
          { withCredentials: true }
        );

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
        setResults([]);
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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4">
              <SidebarFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>

            {/* Product Grid (separated) */}
            <div className="w-full md:w-3/4">
              <ProductGrid
                products={results}
                loading={loading}
                totalResults={totalResults}
                currentPage={Number(pageQuery)}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
