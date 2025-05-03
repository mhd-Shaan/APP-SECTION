import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full py-8 px-0 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Home</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Categories</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Offers</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Customer Service</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Returns</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Order Tracking</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Shipping Policy</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">About Us</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              We offer premium spare parts for all kinds of vehicles, ensuring quality and timely delivery to keep your vehicles running smoothly.
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Follow Us</h3>
            <div className="flex space-x-4 sm:space-x-5">
              {['📘', '📸', '🐦', '🎥'].map((icon, index) => (
                <span 
                  key={index} 
                  className="text-xl cursor-pointer hover:text-yellow-400 transition-colors"
                  aria-label={`Social media icon ${index + 1}`}
                >
                  {icon}
                </span>
              ))}
            </div>
            <div className="mt-4 sm:mt-6">
              <h4 className="font-medium mb-2 text-sm sm:text-base">Subscribe to Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 text-gray-900 text-xs sm:text-sm w-full rounded-l focus:outline-none"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 text-xs sm:text-sm font-medium rounded-r transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-6 text-center text-xs sm:text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <span>© {new Date().getFullYear()} AutoSpareKart. All rights reserved.</span>
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;