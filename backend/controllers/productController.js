import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Product from "../models/productschema.js";
import SubCategory from "../models/SubCatgoery.js";

export const productview = async (req, res) => {
  try {
    const products = await Product.find();
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
        Brands.countDocuments({ isBlocked: false, type: 'OEM' }),
        Brands.countDocuments({ isBlocked: false, type: 'OES' }),
      ]);
  
      // Create base queries
      const oemQuery = Brands.find({ isBlocked: false, type: 'OEM' }).limit(Number(oemlimit));

      const oesQuery = Brands.find({ isBlocked: false, type: 'OES' }).limit(Number(oeslimit));
    
  
      const [oemBrands, oesBrands] = await Promise.all([
        oemQuery,
        oesQuery,
      ]);

  
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
