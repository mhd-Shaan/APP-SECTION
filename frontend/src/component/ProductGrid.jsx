import React from "react";

const products = [
  {
    name: "Brake Disc Rotor",
    price: "₹2999",
    image: "/images/product1.png",
  },
  {
    name: "Brake Disc Rotor",
    price: "₹3599",
    image: "/images/product2.png",
  },
  {
    name: "Engine Disc Repair",
    price: "₹4499",
    image: "/images/product3.png",
  },
  {
    name: "Brake Shoe Set",
    price: "₹1599",
    image: "/images/product4.png",
  },
];

const ProductGrid = () => {
  return (
    <section className="py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Spare Parts</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white">
            <img src={item.image} alt={item.name} className="h-32 mx-auto object-contain" />
            <p className="mt-2 text-center font-semibold text-sm">{item.name}</p>
            <p className="text-center text-yellow-600 font-bold mt-1">{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
