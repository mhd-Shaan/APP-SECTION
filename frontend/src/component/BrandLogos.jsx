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
  const [oesCount, setOesCount] = useState(0);
  const [oemCount, setOemCount] = useState(0);
  const [oesLimit, setOesLimit] = useState(12);
  const [oemLimit, setOemLimit] = useState(12);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        
        const res = await axios.get(`http://localhost:5000/brands?oesLimit=${oesLimit}&oemLimit=${oemLimit}`);
        setOEMBrands(res.data.oem || []);
        setOESBrands(res.data.oes || []);
        setOesCount(res.data.oescount || 0);
        setOemCount(res.data.oemcount || 0);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [oesLimit, oemLimit]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading brands...</div>;
  }

  return (
    <section className="py-10 px-4 bg-gray-50">
      {/* OES Brands */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">OES BRANDS</h2>
            <p className="text-sm text-gray-500">{oesCount} brands available</p>
          </div>
          {oesCount > 12 && (
            <button 
              className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition"
              onClick={() => setOesLimit(oesLimit === 12 ? oesCount : 12)}
            >
              {oesLimit === 12 ? `View All ${oesCount}` : "Show Less"}
            </button>
          )}
        </div>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">OEM BRANDS</h2>
            <p className="text-sm text-gray-500">{oemCount} brands available</p>
          </div>
          {oemCount > 12 && (
            <button 
              className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition"
              onClick={() => setOemLimit(oemLimit === 12 ? oemCount : 12)}
            >
              {oemLimit === 12 ? `View All ${oemCount}` : "Show Less"}
            </button>
          )}
        </div>
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