import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Card ,CardContent} from "@/components/ui/card";
import { ShoppingCart, Search } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import Navbar from "@/component/Navbar";


 function Home() {
  const [search, setSearch] = useState("");

  return (
    <Navbar/>
  );
}
export default Home