import React from "react";

const Footer = () => {
  return (
<footer className="bg-gray-900 text-white py-8 px-6 mt-12">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Categories</li>
            <li>Offers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Customer Service</h3>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Order Tracking</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">About Us</h3>
          <p className="text-xs">
            We offer premium spare parts for all kinds of vehicles, ensuring quality and timely delivery.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-3">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>🎥</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/30 pt-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} AutoSpareKart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
