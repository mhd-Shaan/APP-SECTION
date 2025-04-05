import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/component/Navbar";

const Home = () => {
  return (
    <>
    <Navbar />

    <div className="bg-gray-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">Promo 1</CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">Promo 2</CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">Promo 3</CardContent>
          </Card>
        </div>
      </section>
      
      {/* Vehicle Categories */}
      <section className="container mx-auto py-6 px-4 text-center">
        <h2 className="text-xl font-bold mb-4">Vehicles</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-200 rounded-lg">2-Wheeler</div>
          <div className="p-4 bg-yellow-300 rounded-lg">3-Wheeler</div>
          <div className="p-4 bg-yellow-400 rounded-lg">4-Wheeler</div>
        </div>
      </section>

      {/* OEM & Spare Brands */}
      <section className="container mx-auto py-6 px-4">
        <h2 className="text-xl font-bold mb-4">Search by OEM & Spare Brands</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow-lg rounded-lg">PHILIPS</div>
          <div className="p-4 bg-white shadow-lg rounded-lg">BOSCH</div>
          <div className="p-4 bg-white shadow-lg rounded-lg">NISSAN</div>
          <div className="p-4 bg-white shadow-lg rounded-lg">TOYOTA</div>
        </div>
      </section>
      
      {/* Product Listings */}
      <section className="container mx-auto py-6 px-4">
        <h2 className="text-xl font-bold mb-4">Top Products</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">Product 1</CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">Product 2</CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">Product 3</CardContent>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-white py-6 text-center">
        <p>© 2025 Sparecart. All Rights Reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default Home;
