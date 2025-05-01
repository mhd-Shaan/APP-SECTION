import Brands from "../models/BrandSchema.js";
import Cart from "../models/CartSchema.js";
import Category from "../models/CatgoerySchema.js";
import Product from "../models/productschema.js";
import SubCategory from "../models/SubCatgoery.js";
import Wishlist from "../models/wishlistSchema.js";
import wishlist from "../models/wishlistSchema.js";

export const productview = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error on fetching products" });
  }
};

export const categoryshow = async (req, res) => {
  try {
    const category = await Category.find({ isBlocked: false });
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error on fetching products" });
  }
};

export const brandsshow = async (req, res) => {
  try {
    // Check and parse limit from query params
    const oeslimit = req.query.oesLimit ? parseInt(req.query.oesLimit) : null;
    const oemlimit = req.query.oemLimit ? parseInt(req.query.oemLimit) : null;

    // Count total OEM and OES brands
    const [oemcount, oescount] = await Promise.all([
      Brands.countDocuments({ isBlocked: false, type: "OEM" }),
      Brands.countDocuments({ isBlocked: false, type: "OES" }),
    ]);

    // Create base queries
    const oemQuery = Brands.find({ isBlocked: false, type: "OEM" }).limit(
      Number(oemlimit)
    );

    const oesQuery = Brands.find({ isBlocked: false, type: "OES" }).limit(
      Number(oeslimit)
    );

    const [oemBrands, oesBrands] = await Promise.all([oemQuery, oesQuery]);

    // Send response
    res.status(200).json({
      oem: oemBrands,
      oes: oesBrands,
      oemcount,
      oescount,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Error fetching brands" });
  }
};

export const SubCategoryShow = async (req, res) => {
  try {
    const SubCategoryId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const filter = { CategoryId: SubCategoryId };

    const totalSubCategories = await SubCategory.countDocuments(filter);
    const SubCategorydetails = await SubCategory.find(filter)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      subCategories: SubCategorydetails,
      totalSubCategories,
      currentPage: Number(page),
      totalPages: Math.ceil(totalSubCategories / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addwishlist = async (req, res) => {
  try {
    const userId = req.User;

    const { productId } = req.body;
    console.log(productId);

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // If no wishlist exists, create one
      wishlist = new Wishlist({
        user: userId,
        items: [{ product: productId }],
      });
    } else {
      // Check if the product is already in the wishlist
      const alreadyExists = wishlist.items.some(
        (item) => item.product.toString() === productId
      );

      if (alreadyExists) {
        return res.status(409).json({ message: "Product already in wishlist" });
      }

      // Add the product to the wishlist
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const showwishlist = async (req, res) => {
  try {
    const userId = req.User;

    const showproducts = await Wishlist.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!showproducts) {
      return res.status(404).json({ error: "No wishlist found" });
    }

    res.status(200).json({ showproducts });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletewishlist = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { "items._id": itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addcart = async (req, res) => {
  try {
    const userId = req.User._id;
    console.log("Authenticated User ID:", userId); // Debugging line

    const { productId, quantity } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check for existing cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
            priceAtAddTime: product.price,
          },
        ],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity || 1;
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
          priceAtAddTime: product.price,
        });
      }
    }

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const viewCart = async (req, res) => {
  try {
    const userId = req.User._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res
        .status(200)
        .json({ success: true, cart: [], message: "Cart is empty" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("View cart error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const updateCartItem = async (req, res) => {
//   try {
//     const userId = req.User._id;
//     const itemId = req.params.itemId;
//     const { quantity } = req.body;

//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

//     const item = cart.items.id(itemId);
//     if (!item) return res.status(404).json({ success: false, message: "Item not found" });

//     item.quantity = quantity;
//     await cart.save();

//     res.status(200).json({ success: true, message: "Cart updated", cart });
//   } catch (error) {
//     console.error("Update cart error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.User._id;

    const itemId = req.params.id;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const productviewbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.findById(id)
      .populate("brand", "image name")
      .populate("category", "name")
      .exec();

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error on fetching products" });
  }
};

export const searchquery = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", filter = "" } = req.query;

    const skip = (page - 1) * limit;

    const searchFilter = {
      $or: [
        { productName: { $regex: search, $options: "i" } },
        // Additional filters can be added here if necessary
      ],
    };

    if (!search.trim()) {
      delete searchFilter.$or;
    }

    const totalproduct = await Product.countDocuments(searchFilter);
    const products = await Product.find(searchFilter)
      .skip(skip)
      .limit(Number(limit))
      .populate("brand", "name image"); // Populate only 'name' and 'image' fields of the brand

    res.status(200).json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalproduct / limit),
      totalproduct,
    });
  } catch (error) {
    console.log("Error in searchquery:", error);
    res.status(500).json({ error: error.message });
  }
};
