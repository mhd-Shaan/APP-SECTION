import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data.products); 
      console.log(response.data.products);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Spare Parts</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white">
            <img
              src={item.images}
              alt={item.productName}
              className="h-32 mx-auto object-contain"
            />
            <p className="mt-2 text-center font-semibold text-sm">
              {item.productName}
            </p>
            <p className="text-center text-yellow-600 font-bold mt-1">
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
