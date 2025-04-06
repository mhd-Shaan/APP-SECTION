import React from "react";

const features = [
  "People Trust", "Licensed Vendor", "Top Rated", "Secure Payment", "Timely Delivery"
];

const ProductFilters = () => {
  return (
    <section className="py-6 px-4 bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {features.map((f, i) => (
          <div key={i} className="bg-white shadow-sm p-4 text-center rounded-lg">
            <p className="text-sm font-semibold">{f}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFilters;
