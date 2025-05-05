import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  ShoppingCart,
  Search,
  User,
  ChevronDown,
  MapPin,
  Heart,
  LogOut,
  Clipboard,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchResults from "./SearchResults";
import axios from "axios";
import { toast } from "react-hot-toast";
import { compose } from "@reduxjs/toolkit";
import ProductSlider from "./ProductGrid";
import { loginuser } from "@/redux/userslice";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(user?.city || "");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isUpdatingCity, setIsUpdatingCity] = useState(false);
  // const [menuOpenn, setMenuOpenn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
  const profileRef = useRef(null); // To detect clicks outside


  useEffect(() => {
    fetchCities();
  }, []);



  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/viewcity");
      setCities(response.data.viewcity || []);
    } catch (error) {
      toast.error("Failed to load cities");
    }
  };

  const updateUserCity = async (city) => {
    if (!city) return;

    try {
      setIsUpdatingCity(true);
      const { data } = await axios.put(
        "http://localhost:5000/updatecity",
        { city },
        { withCredentials: true }
      );
      setSelectedCity(data.user.city);
      toast.success(`Location updated to ${data.user.city}`);
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        toast.error("Please login to change location");
      } else {
        toast.error("Failed to update location");
      }
    } finally {
      setIsUpdatingCity(false);
      setShowCityDropdown(false);

    }
  };

  const handleCityChange = async (city) => {
    if (city === selectedCity) {
      setShowCityDropdown(false);
      return;
    }
    await updateUserCity(city);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 border-b border-yellow-600 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-black">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-yellow-100 w-64 p-6 space-y-6">
              {[
                { name: "Home", path: "/" },
                { name: "Stores", path: "/stores" },
                { name: "About", path: "/about" },
                { name: "Become Seller", path: "/become-seller" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-black text-lg font-medium hover:text-yellow-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-black border-yellow-500"
                >
                  <Link to="/login">
                    <LogIn size={20} className="mr-2" /> Login
                  </Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-black font-extrabold text-xl sm:text-2xl">
            Sparemart
          </Link>
        </div>

        {/* Search + City Dropdown (Desktop Only) */}
        <div className="hidden md:flex items-center flex-grow max-w-2xl mx-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-grow relative">
            <div className="flex border-2 border-yellow-400 rounded-full px-4 py-1.5 items-center bg-white shadow-sm w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-grow text-black bg-transparent outline-none placeholder-gray-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              <button type="submit" className="text-yellow-600 hover:text-yellow-700">
                <Search size={20} />
              </button>
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                <SearchResults
                  results={searchResults}
                  onResultClick={() => {
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                />
              </div>
            )}
          </form>

          {/* City Dropdown */}
          <div className="relative ml-3 w-48">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className={`flex items-center justify-between w-full bg-white border-2 border-yellow-400 rounded-full px-4 py-1.5 text-black shadow-sm ${
                showCityDropdown ? "bg-yellow-50" : "hover:bg-yellow-50"
              } ${isUpdatingCity ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={isUpdatingCity}
            >
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-yellow-600" />
                <span className="truncate text-sm">
                  {isUpdatingCity ? "Updating..." : selectedCity || "Select City"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${showCityDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showCityDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <div
                    key={city._id}
                    className={`px-4 py-2 hover:bg-yellow-50 cursor-pointer text-sm ${
                      selectedCity === city.city ? "bg-yellow-100 font-medium" : ""
                    }`}
                    onClick={() => handleCityChange(city.city)}
                  >
                    <MapPin size={14} className="inline-block mr-2 text-yellow-600" />
                    {city.city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/become-seller"
            className="hidden md:block text-black font-medium hover:text-yellow-700 text-sm"
          >
            Become Seller
          </Link>

          {!user && (
            <Link
              to="/login"
              className="hidden md:block text-black font-medium hover:text-yellow-700 text-sm"
            >
              Login
            </Link>
          )}

          <Link to="/wishlist" className="text-black hover:text-yellow-700">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="text-black hover:text-yellow-700">
            <ShoppingCart size={20} />
          </Link>
          <div className="relative" ref={profileRef}>
            <button
              className="text-black hover:text-yellow-700 flex items-center space-x-1"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <User size={22} />
              <ChevronDown size={16} />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-sm text-gray-700 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-yellow-50 flex items-center">
                      <User size={16} className="mr-2" /> My Profile
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-yellow-50 flex items-center">
                      <Heart size={16} className="mr-2" /> Wishlist
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 text-sm hover:bg-yellow-50 flex items-center">
                      <ShoppingCart size={16} className="mr-2" /> Cart
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-yellow-50 flex items-center">
                      <Clipboard size={16} className="mr-2" /> Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-3 text-sm text-center hover:bg-yellow-50">
                    <LogIn size={16} className="mr-2" /> Login
                  </Link>
                )}
              </div>
            )}
      </div>
    </div>
    </div>
    </div>
  )
};

export default Navbar;
