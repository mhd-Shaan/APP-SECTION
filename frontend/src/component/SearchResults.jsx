import Navbar from "./Navbar";
import Footer from "./Footer";
import SidebarFilters from "@/ProductList/SidebarFilters";
import Breadcrumbs from "@/ProductList/Breadcrumbs";
import SortOptions from "@/ProductList/SortOptions";
import ProductGrid from "@/ProductList/ProductGrid";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      {/* 5% vertical gap */}
      <div className="h-[5vh]" />

      <div className="flex flex-1">
        {/* Sidebar Filters */}
        <div className="w-1/5 bg-white border-r px-4 pt-12">
          <SidebarFilters />
        </div>

        {/* Main Content */}
        <main className="w-4/5 px-4 pt-5 	 ">
          {/* <Breadcrumbs />
          <SortOptions /> */}

          <div className="py-4">
            <ProductGrid />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
