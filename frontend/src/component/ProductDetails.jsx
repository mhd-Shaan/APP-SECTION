import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetails() {
  const [productdetails, setProductDetails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchproductdetails();
    // fetchRelatedProducts();
  }, []);

  const fetchproductdetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/productdetails/${id}`,
        { withCredentials: true }
      );
      setProductDetails(res.data.products);
      console.log(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchRelatedProducts = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:5000/related-products/${id}`,
  //       { withCredentials: true }
  //     );
  //     setRelatedProducts(res.data.products);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-600 mb-6">
        <a href="#" className="hover:text-primary">
          Home
        </a>
        <ChevronRight className="w-4 h-4 mx-2" />
        <a href="#" className="hover:text-primary">
          Category
        </a>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800">Product Name</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div>
          {/* Main Image */}
          <Card className="overflow-hidden mb-4">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                src={productdetails.images?.[0] || "/placeholder.png"}
                alt="Product"
                className="object-cover w-full h-full"
              />
            </div>
          </Card>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-2">
            {productdetails.images?.map((item, index) => (
              <button
                key={index}
                className="aspect-square border rounded-md overflow-hidden"
              >
                <img
                  src={item || "/placeholder-image.png"} // Fallback image if item is undefined
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{productdetails.productName}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(42 reviews)</span>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-primary mr-3">
                ${productdetails.price}
              </span>
              {false && ( // Example of sale price
                <span className="text-xl text-gray-500 line-through">
                  $249.99
                </span>
              )}
              {true && ( // Example of sale badge
                <Badge variant="destructive" className="ml-2">
                  {productdetails.discount}% OFF
                </Badge>
              )}
            </div>
            <p className="text-green-600 mt-1">In Stock</p>
          </div>

          {/* Variant Selection */}
          <div className="space-y-4 mb-6">

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <div className="flex items-center space-x-2 w-[120px]">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <span>-</span>
                </Button>
                <Input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="text-center"
                />
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <span>+</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
            <Button className="flex-1 py-6 text-lg">Add to Cart</Button>
            <Button variant="outline" className="flex-1 py-6 text-lg">
              Buy Now
            </Button>
          </div>

          {/* Share and Details */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Share2 className="w-5 h-5 mr-2" />
              <span>Share this product</span>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <Card key={product._id} className="flex flex-col items-center">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="text-center mt-4">
                <h4 className="text-lg font-medium">{product.name}</h4>
                <p className="text-gray-600 mt-2">${product.price}</p>
                <Button variant="link" className="text-sm text-primary mt-2">
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Tabs Section */}
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
                <p className="text-gray-700">
                {productdetails.description}
                </p>
               
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">General Information</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>
                        <span className="font-medium">Brand:</span> ProductCo
                      </li>
                      <li>
                        <span className="font-medium">Category:</span> Electronics
                      </li>
                      <li>
                        <span className="font-medium">Warranty:</span> 2 years
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Dimensions & Weight</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>
                        <span className="font-medium">Length:</span> 10 inches
                      </li>
                      <li>
                        <span className="font-medium">Width:</span> 5 inches
                      </li>
                      <li>
                        <span className="font-medium">Height:</span> 3 inches
                      </li>
                      <li>
                        <span className="font-medium">Weight:</span> 1.2 lbs
                      </li>
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
                {/* Sample Review */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium">John Doe</h4>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        Great product! It exceeded my expectations and works
                        perfectly for my needs. Highly recommend!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 mb-3 rounded-md"></div>
                <h3 className="font-medium mb-1">Related Product {item}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">(12)</span>
                </div>
                <p className="font-bold text-primary">$149.99</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
        </Tabs>
      </div>
    </div>
  );
}
