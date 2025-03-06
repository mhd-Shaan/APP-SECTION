import React from "react";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`border p-2 rounded-md ${className}`}
      {...props}
    />
  );
};

export { Input };
