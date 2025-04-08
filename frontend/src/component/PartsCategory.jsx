import React from "react";

const categories = [
  { name: "Service Parts", icon: "🔧" },
  { name: "Steering & Suspension", icon: "🛠️" },
  { name: "Consumables, General", icon: "🧴" },
  { name: "Electrical", icon: "💡" },
  { name: "Wheels", icon: "🛞" },
  { name: "Vision & Safety", icon: "👁️" },
  { name: "Interior", icon: "🪑" },
];

const products = [
  {
    name: "RADIATOR FLUSH CLEANER",
    image: "https://www.liqui-moly.com/fileadmin/_processed_/1/b/csm_1804_1500_02_0a790f6b14.png",
    sample: false,
  },
  {
    name: "SEALANT",
    image: "https://via.placeholder.com/120x150?text=Sealant",
    sample: true,
  },
  {
    name: "TAPE, PVC INSULATION",
    image: "https://via.placeholder.com/120x150?text=PVC+Tape",
    sample: true,
  },
  {
    name: "AC CLEANER/DISINFECTANT",
    image: "https://via.placeholder.com/120x150?text=AC+Cleaner",
    sample: false,
  },
];

const PartsCategory = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          SEARCH BY <span className="font-bold text-teal-700">CATEGORY</span>
        </h2>
        <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition">
          View All <span className="ml-1 font-bold">21</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="flex items-center gap-2 bg-blue-50 text-gray-800 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-100 transition"
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition relative"
          >
            {item.sample && (
              <div className="absolute top-2 left-2 bg-yellow-300 text-black text-xs px-2 py-0.5 rounded font-semibold">
                SAMPLE IMAGE
              </div>
            )}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-contain mb-3"
            />
            <h3 className="text-sm font-semibold text-center text-gray-800">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsCategory;
