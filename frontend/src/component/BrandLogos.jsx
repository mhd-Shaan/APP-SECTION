import React from "react";

// Sample brand data
const OESBrands = [
  { name: "BOSCH", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/270423114245-BOSCH.png", products: "100+ Products" },
  { name: "ELOFIC", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/250423122041-ELOFIC.png", products: "100+ Products" },
  { name: "BHARATH FILTERS", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/1732.png", products: "100+ Products" },
  { name: "PHILIPS", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/250423042751-PHILIPS.png", products: "84 Products" },
  { name: "DAYCO", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/250423022323-DAYCO.png", products: "100+ Products" },
  { name: "ZIP", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/250423044536-ZIP.png", products: "100+ Products" },
];

const OEMBrands = [
  { name: "TOYOTA", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/365.png", products: "100+ Products" },
  { name: "NISSAN", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/260920081556-nissan.png", products: "100+ Products" },
  { name: "RENAULT", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/359.png", products: "100+ Products" },
  { name: "SKODA", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/362.png", products: "100+ Products" },
  { name: "VOLKSWAGEN", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/366.png", products: "100+ Products" },
  { name: "HYUNDAI", logo: "https://az-prd-images-azvpc.s3.ap-south-1.amazonaws.com/brand/338.png", products: "100+ Products" },
];

const BrandCard = ({ logo, name, products }) => (
  <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition">
    <img src={logo} alt={name} className="h-12 mx-auto mb-2 object-contain" />
    <h4 className="font-semibold text-sm">{name}</h4>
    <p className="text-teal-600 text-sm font-medium hover:underline cursor-pointer">
      {products}
    </p>
  </div>
);

const BrandGrid = () => {
  return (
    <section className="py-10 px-4 bg-gray-50">
      {/* OES Brands */}
      <div className="mb-8">
        <h2 className="text-center text-lg font-semibold mb-4">OES BRANDS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {OESBrands.map((brand, i) => (
            <BrandCard key={i} {...brand} />
          ))}
        </div>
      </div>

      {/* OEM Brands */}
      <div>
        <h2 className="text-center text-lg font-semibold mb-4">OEM BRANDS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {OEMBrands.map((brand, i) => (
            <BrandCard key={i} {...brand} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGrid;
