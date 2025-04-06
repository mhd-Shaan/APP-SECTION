import React from "react";

const FeatureCard = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition duration-300">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-semibold text-center">{title}</p>
    </div>
  );
};

export default FeatureCard;
