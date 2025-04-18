import React from "react";
import Navbar from "../component/Navbar";
import BannerCarousel from "../component/BannerCarousel";
import VehicleCategory from "../component/VehicleCategory";
import PosterSection from "../component/PosterSection";
import BrandLogos from "../component/BrandLogos";
import ProductFilters from "../component/ProductFilters";
import ProductGrid from "../component/ProductGrid";
import Footer from "../component/Footer";
import PartsCategory from "@/component/PartsCategory";

const Home = () => {
  return (
    <>
      <Navbar />
      <BannerCarousel />
      <PartsCategory/>
      <VehicleCategory />
      <PosterSection />
      <BrandLogos />
      <ProductFilters />
      <ProductGrid />
      <Footer />
    </>
  );
};

export default Home;
