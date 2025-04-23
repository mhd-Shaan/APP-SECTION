import React from "react";
import { Button } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import WishlistButton from "./WishlistButton";
import ProductSlider from "./ProductSlider";
import toast from "react-hot-toast";
import axios from "axios";

const ProductDetails = ({ product }) => {
    const { id } = useParams();
    const { state } = useLocation();
    const [product, setProduct] = useState(state?.product || null);
    console.log('hi'.id);
    console.log('hello',state);
    
    
  
    useEffect(() => {
      if (!product) {
        axios.get(`http://localhost:5000/products/${id}`)
          .then(res => setProduct(res.data))
          .catch(err => console.error("Error fetching product:", err));
      }
    }, [id, product]);
  
    if (!product) {
      return <div className="p-6 text-center text-gray-600">Loading product...</div>;
    }

  return (
    <div className="bg-white px-6 md:px-20 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <img src={product.images} className="w-full rounded-xl object-contain" alt="product" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={product.images} className="w-20 h-20 rounded-lg object-cover border" alt="thumb" />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{product.productName}</h2>
          <p className="text-sm text-gray-500">{product.description}</p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-blue-700">₹{product.price}</span>
            <span className="text-base line-through text-gray-400">
              ₹{(product.price * 1.175).toFixed(2)}
            </span>
            <Badge className="bg-yellow-400 text-white">15% OFF</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded"
              min={1}
            />
            <Button variant="contained" onClick={addToCart} className="bg-blue-600 text-white">
              Add to Cart
            </Button>
            <WishlistButton productId={product._id} />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">Delivery & Return</h3>
            <p className="text-sm text-gray-500">Free Delivery on orders above ₹500. Easy 7-day returns.</p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-20">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Similar Products</h3>
        <ProductSlider />
      </div>
    </div>
  );
};

export default ProductDetails;
