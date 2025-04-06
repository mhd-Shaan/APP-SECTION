import React from "react";

const brands = ["philips.png", "bosch.png", "nissan.png", "toyota.png", "skoda.png", "renault.png"];

const BrandLogos = () => {
  return (
    <section className="py-8 px-4 bg-yellow-400">
      <h2 className="text-xl font-bold mb-4">Search by OES & OEM</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((logo, i) => (
          <img key={i} src={`/images/${logo}`} alt={`brand-${i}`} className="h-16 mx-auto" />
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;
