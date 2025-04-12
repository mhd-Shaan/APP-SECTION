import React, { useEffect, useState } from "react";
import axios from "axios";

// Brand card component
const BrandCard = ({ image, name, productCount }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition border border-gray-100">
    <img src={image} alt={name} className="h-10 mx-auto mb-3 object-contain" />
    <h4 className="font-semibold text-sm mb-1 uppercase">{name}</h4>
    <p className="text-sm text-teal-600 font-medium">
      {productCount >= 100 ? "100+ Products" : `${productCount} Products`}
    </p>
  </div>
);

// Brand grid component
const BrandGrid = () => {
  const [OEMBrands, setOEMBrands] = useState([]);
  const [OESBrands, setOESBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:5000/brands");
        const allBrands = res.data.brands || [];

        const filtered = allBrands.filter((brand) => !brand.isBlocked);

        setOEMBrands(filtered.filter((brand) => brand.type === "OEM"));
        setOESBrands(filtered.filter((brand) => brand.type === "OES"));
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading brands...</div>;
  }

  return (
    <section className="py-10 px-4 bg-gray-50">
      {/* OES Brands */}
      <div className="mb-12">
        <h2 className="text-center text-xl font-semibold mb-6">OES BRANDS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {OESBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              image={brand.image}
              name={brand.name}
              productCount={brand.productCount || 100}
            />
          ))}
        </div>
      </div>

      {/* OEM Brands */}
      <div>
        <h2 className="text-center text-xl font-semibold mb-6">OEM BRANDS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {OEMBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              image={brand.image}
              name={brand.name}
              productCount={brand.productCount || 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGrid;
