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