import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ShoppingCart, Search, User, ChevronDown, MapPin, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchResults from "./SearchResults";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(user?.city||'');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isUpdatingCity, setIsUpdatingCity] = useState(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    fetchCities();
    console.log(user?.city);
    
    // if (user?.city) {
    //   setSelectedCity(user.city);
    // }
  }, [user?.city,selectedCity]); 
  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/viewcity");
      setCities(response.data.viewcity || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      toast.error("Failed to load cities");
      setCities([]);
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
      
      // Update local state with the new city from response
      setSelectedCity(data.user.city);
      toast.success(`Location updated to ${data.user.city}`);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
        toast.error("Please login to change location");
      } else {
        console.error("Failed to update city:", error);
        toast.error("Failed to update location");
      }
    } finally {
      setIsUpdatingCity(false);
      setShowCityDropdown(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}&city=${selectedCity}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleCityChange = async (city) => {
    if (city === selectedCity) {
      setShowCityDropdown(false);
      return;
    }
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
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
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

          <Link to="/" className="text-black font-extrabold text-xl sm:text-2xl">
            Sparemart
          </Link>
        </div>

        {/* Middle Section - Search (Mobile) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => navigate('/search')} className="text-black">
            <Search size={20} />
          </button>
        </div>

        {/* Middle Section - Search and City Dropdown (Desktop) */}
        <div className="hidden md:flex items-center flex-grow max-w-2xl mx-4 lg:mx-6">
          <div className="flex-grow relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex border-2 border-yellow-400 rounded-full px-4 py-1.5 items-center bg-white w-full shadow-sm">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-grow text-black outline-none bg-transparent placeholder-gray-500 text-sm sm:text-base"
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
          <div className="relative ml-2 lg:ml-4 w-40 lg:w-48">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className={`flex items-center justify-between w-full bg-white border-2 border-yellow-400 rounded-full px-3 lg:px-4 py-1.5 text-black shadow-sm transition-colors ${
              showCityDropdown ? 'bg-yellow-50' : 'hover:bg-yellow-50'
            } ${isUpdatingCity ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isUpdatingCity}
          >
            <div className="flex items-center">
              <MapPin size={16} className="mr-1 lg:mr-2 text-yellow-600" />
              <span className="truncate text-sm lg:text-base">
                {isUpdatingCity ? (
                  <span className="animate-pulse">Updating...</span>
                ) : selectedCity || "Select City"}
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`ml-1 transition-transform ${
                showCityDropdown ? 'rotate-180' : ''
              } ${isUpdatingCity ? 'animate-bounce' : ''}`} 
            />
          </button>
          
          {showCityDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
              {cities.map((city) => (
                <div
                  key={city._id}
                  className={`px-3 lg:px-4 py-2 hover:bg-yellow-50 cursor-pointer flex items-center text-sm lg:text-base ${
                    selectedCity === city.city ? 'bg-yellow-100 font-medium' : ''
                  }`}
                  onClick={() => handleCityChange(city.city)}
                >
                  <MapPin size={14} className="mr-1 lg:mr-2 text-yellow-600" />
                  <span className="truncate">{city.city}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/become-seller" className="hidden md:block text-black font-medium hover:text-yellow-700 transition-colors text-sm lg:text-base">
            Become seller
          </Link>

          {!user && (
            <Link to="/login" className="hidden md:block text-black font-medium hover:text-yellow-700 transition-colors text-sm lg:text-base">
              Login
            </Link>
          )}

          <Link to="/wishlist" className="text-black hover:text-yellow-700 transition-colors">
            <Heart size={20} className="sm:h-6 sm:w-6" />
          </Link>
          <Link to="/cart" className="text-black hover:text-yellow-700 transition-colors">
            <ShoppingCart size={20} className="sm:h-6 sm:w-6" />
          </Link>
          <Link to="/profile" className="text-black hover:text-yellow-700 transition-colors">
            <User size={20} className="sm:h-6 sm:w-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar (when active) */}
      {false && ( // You can implement mobile search toggle if needed
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex border-2 border-yellow-400 rounded-full px-4 py-2 items-center bg-white w-full shadow-sm">
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-grow text-black outline-none bg-transparent placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="text-yellow-600 hover:text-yellow-700">
                <Search size={20} className="cursor-pointer" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;