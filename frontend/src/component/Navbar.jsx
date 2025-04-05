import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn, ShoppingCart, Search, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 backdrop-blur-lg shadow-lg border-b border-yellow-600 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 sm:px-8 lg:px-10 py-3">
        
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
                { name: "Become Seller", path: "/become-seller" }, // <-- Added here
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-black text-lg font-medium hover:text-yellow-600"
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
        <div className="hidden md:flex flex-grow max-w-md mx-auto border border-yellow-400 rounded-full px-4 py-1 items-center bg-white">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow text-black outline-none bg-transparent"
          />
          <Search size={20} className="text-yellow-600 cursor-pointer" />
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
