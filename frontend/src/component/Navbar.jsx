import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <AppBar position="fixed" className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200">
      <Toolbar className="max-w-screen-xl mx-auto w-full flex justify-between px-6 sm:px-8 lg:px-10">
        {/* Logo */}
        <Typography variant="h6" component={Link} to="/" className="text-red-600 font-extrabold text-2xl">
          Sparecart
        </Typography>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6">
          {[{ name: "Home", path: "/" },
            ...(!user ? [{ name: "Login", path: "/login" }] : []),
            { name: "Stores", path: "/stores" },
            { name: "About", path: "/about" }].map((item) => (
            <Link key={item.name} to={item.path} className="text-gray-900 text-lg font-medium hover:text-red-600 transition-all">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <IconButton className="lg:hidden text-gray-900">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </IconButton>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white w-64 p-6 flex flex-col space-y-6">
            {[{ name: "Home", path: "/" }, { name: "Stores", path: "/stores" }, { name: "About", path: "/about" }].map((item) => (
              <Link key={item.name} to={item.path} className="text-gray-900 text-lg font-medium hover:text-red-600">
                {item.name}
              </Link>
            ))}
            {!user && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <LogIn size={20} className="mr-2" /> Login
                </Link>
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
