import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ShoppingCart, Search, User, ChevronDown, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchResults from "./SearchResults";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isUpdatingCity, setIsUpdatingCity] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/viewcity");
      setCities(response.data.viewcity || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    }
  };

  const updateUserCity = async (city) => {
    try {
      await axios.put("http://localhost:5000/updatecity", 
        {city},
       { withCredentials: true, 
      });
    } catch (error) {
      if(error.response.status === 401){
        navigate('/login')
      }else{
        console.log("Failed to update city:", error);
      }
    } finally {
      setIsUpdatingCity(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}&city=${selectedCity}`);
      setShowResults(false);
    }
  };

  const handleCityChange = async (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    await updateUserCity(city);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 backdrop-blur-lg shadow-lg border-b border-yellow-600 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-black">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-yellow-100 w-64 p-6 flex flex-col space-y-6">
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
                <Button asChild variant="outline" className="w-full text-black border-yellow-500">
                  <Link to="/login">
                    <LogIn size={20} className="mr-2" /> Login
                  </Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-black font-extrabold text-2xl">
            Sparemart
          </Link>
        </div>

        {/* Middle Section - Search and City Dropdown */}
        <div className="hidden md:flex items-center flex-grow max-w-2xl mx-6">
          {/* Search Bar */}
          <div className="flex-grow relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex border-2 border-yellow-400 rounded-full px-4 py-1.5 items-center bg-white w-full shadow-sm">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-grow text-black outline-none bg-transparent placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
                <button type="submit" className="text-yellow-600 hover:text-yellow-700">
                  <Search size={20} className="cursor-pointer" />
                </button>
              </div>
            </form>
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto border border-gray-200">
                <SearchResults 
                  results={searchResults} 
                  onResultClick={() => {
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                />
              </div>
            )}
          </div>

          {/* City Dropdown */}
          <div className="relative ml-4 w-48">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className={`flex items-center justify-between w-full bg-white border-2 border-yellow-400 rounded-full px-4 py-1.5 text-black shadow-sm transition-colors ${showCityDropdown ? 'bg-yellow-50' : 'hover:bg-yellow-50'}`}
              disabled={isUpdatingCity}
            >
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-yellow-600" />
                <span className="truncate">
                  {isUpdatingCity ? "Updating..." : selectedCity || "Select City"}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`ml-2 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showCityDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
                {cities.map((city) => (
                  <div
                    key={city._id}
                    className={`px-4 py-2 hover:bg-yellow-50 cursor-pointer flex items-center ${selectedCity === city.city ? 'bg-yellow-100' : ''}`}
                    onClick={() => handleCityChange(city.city)}
                  >
                    <MapPin size={14} className="mr-2 text-yellow-600" />
                    <span className="truncate">{city.city}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/become-seller" className="hidden md:block text-black font-medium hover:text-yellow-700 transition-colors">
            Become seller
          </Link>

          {!user && (
            <Link to="/login" className="hidden md:block text-black font-medium hover:text-yellow-700 transition-colors">
              Login
            </Link>
          )}

          <Link to="/wishlist" className="text-black hover:text-yellow-700 transition-colors">
            ❤️
          </Link>
          <Link to="/cart" className="text-black hover:text-yellow-700 transition-colors">
            <ShoppingCart size={24} />
          </Link>
          <Link to="/profile" className="text-black hover:text-yellow-700 transition-colors">
            <User size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;