import Navbar from "./Navbar";
import Footer from "./Footer";
import SidebarFilters from "@/ProductList/SidebarFilters";
import Breadcrumbs from "@/ProductList/Breadcrumbs";
import SortOptions from "@/ProductList/SortOptions";
import ProductGrid from "@/ProductList/ProductGrid";
import { useEffect, useState } from "react";

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
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-1/5 bg-white border-r px-4 pt-12">
          <SidebarFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMobileFilters}
            />
            <div className="fixed inset-y-0 left-0 w-4/5 bg-white z-50 overflow-y-auto md:hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button onClick={toggleMobileFilters}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <SidebarFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
          </>
        )}

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