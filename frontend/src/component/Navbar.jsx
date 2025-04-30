import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ShoppingCart, Search, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchResults from "./SearchResults"; // You'll need to create this component
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // // Debounce search input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (searchQuery.trim() !== "") {
  //       fetchSearchResults(searchQuery);
  //     } else {
  //       setShowResults(false);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [searchQuery]);

  // const fetchSearchResults = async (query) => {
  //   try {
  //     // Replace with your actual API call
  //     const response = await axios.get(`http://localhost:5000/searchview${query}`,
  //     );
  //     const data = await response.json();
  //     setSearchResults(data);
  //     setShowResults(true);
  //   } catch (error) {
  //     console.log("Search error:", error);
  //   }
  // };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 backdrop-blur-lg shadow-lg border-b border-yellow-600 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 sm:px-8 lg:px-10 py-3 relative">
        
        {/* Left Section */}
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

          <Link to="/" className="text-black font-extrabold text-2xl">
            Sparemart
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-md mx-auto relative">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex border border-yellow-400 rounded-full px-4 py-1 items-center bg-white w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-grow text-black outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              <button type="submit">
                <Search size={20} className="text-yellow-600 cursor-pointer" />
              </button>
            </div>
          </form>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              <SearchResults 
                results={searchResults} 
                onResultClick={handleResultClick}
              />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/become-seller" className="text-black font-medium hidden md:block">
            Become seller
          </Link>

          {!user && (
            <Link to="/login" className="text-black font-medium hidden md:block">
              Login
            </Link>
          )}

          <Link to="/wishlist" className="text-black">
            ❤️
          </Link>
          <Link to="/cart" className="text-black">
            <ShoppingCart size={24} />
          </Link>
          <Link to="/profile" className="text-black">
            <User size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;