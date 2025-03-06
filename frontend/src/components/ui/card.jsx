import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`border p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export { Card, CardContent };
