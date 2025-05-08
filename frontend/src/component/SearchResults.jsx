import Navbar from "./Navbar";
import Footer from "./Footer";
import SidebarFilters from "@/ProductList/SidebarFilters";
import SortOptions from "@/ProductList/SortOptions";
import ProductGrid from "@/ProductList/ProductGrid";
import { useState } from "react";

const MainLayout = () => {
  const [filters, setFilters] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleMobileFilters = () => {    
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      {/* 5% vertical gap */}
      <div className="h-[5vh]" />

      <div className="flex flex-1">
        {/* Single Sidebar Filters Component */}
        <SidebarFilters 
          onFilterChange={handleFilterChange}
          isMobileOpen={mobileFiltersOpen}
          onMobileClose={toggleMobileFilters}
        />

        {/* Main Content */}
        <main className="w-full md:w-4/5 px-4 pt-5">
          <SortOptions onMobileFilterClick={toggleMobileFilters} />
          <div className="py-4">
            <ProductGrid filters={filters} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;