import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes] = await Promise.all([
          axios.get(`http://localhost:5000/productdetails/${id}`),
        ]);
        
        setProduct(productRes.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(prev => Math.max(1, prev + value));
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
          <Navbar />
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
          <Navbar />
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="text-gray-600 mt-2">The requested product could not be loaded.</p>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content with container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        <Navbar />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-600 mb-6">
          <a href="#" className="hover:text-primary">Home</a>
          <ChevronLeft className="w-4 h-4 mx-2" />
          <a href="#" className="hover:text-primary">{product.category?.name || "Category"}</a>
          <ChevronLeft className="w-4 h-4 mx-2" />
          <span className="text-gray-800">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images?.[selectedImage] || "/placeholder.png"}
                  alt={product.productName}
                  className="object-contain w-full h-full p-4"
                  loading="lazy"
                />
              </div>
            </Card>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`aspect-square border rounded-md overflow-hidden transition-all ${
                      selectedImage === index ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-gray-300"
                    }`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.floor(product.rating || 0) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.ratingCount || 0} reviews)</span>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-primary mr-3">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.mrp}</span>
                )}
                {product.discount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <p className={`text-sm ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
              </p>
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium mb-1">{variant.type}</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${variant.type}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.options.map((option, j) => (
                          <SelectItem key={j} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <div className="flex items-center space-x-2 w-[120px]">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <span>-</span>
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleQuantityChange(1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="flex-1 py-6 text-lg" disabled={product.stockQuantity <= 0}>
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 py-6 text-lg" disabled={product.stockQuantity <= 0}>
                Buy Now
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center text-gray-600 hover:text-primary cursor-pointer">
                <Share2 className="w-5 h-5 mr-2" />
                <span>Share this product</span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Product Details</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><span className="font-medium">Brand:</span> {product.brand?.name || "N/A"}</li>
                  <li><span className="font-medium">SKU:</span> {product.productId}</li>
                  <li><span className="font-medium">Category:</span> {product.category?.name || "N/A"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description || "No description available."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">General</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li><span className="font-medium">Brand:</span> {product.brand?.name || "N/A"}</li>
                        <li><span className="font-medium">VechicleBrand:</span> {product.vehicleBrand || "N/A"}</li>
                        <li><span className="font-medium">Warranty:</span> {product.warranty || "1 year"}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Dimensions</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li><span className="font-medium">Weight:</span> {product.weight || "N/A"}</li>
                        <li><span className="font-medium">Dimensions:</span> {product.dimensions || "N/A"}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {review.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{review.userName || "Anonymous"}</h4>
                              <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? "fill-current" : ""}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                            <p className="mt-2 text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <Card key={product._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 mb-3 rounded-md overflow-hidden">
                      <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.productName}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium mb-1 line-clamp-1">{product.productName}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= Math.floor(product.rating || 0) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.ratingCount || 0})</span>
                    </div>
                    <p className="font-bold text-primary">₹{product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full width footer */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}