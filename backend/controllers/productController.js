import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Product from "../models/productschema.js";

export const productview =async(req,res)=>{
    try {
        const products = await Product.find()
        res
        .status(200)
        .json({products });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"error on fetching products"})
    }
}

export const categoryshow = async(req,res)=>{
    try {
        const category = await Category.find()
        res
        .status(200)
        .json({category });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"error on fetching products"})
    }
}

export const brandsshow = async(req,res)=>{
    try {


        const brands = await Brands.find()
        res
        .status(200)
        .json({brands });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"error on fetching products"})
    }
}