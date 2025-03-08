import dotenv from 'dotenv'
import bcrypt, { hash } from 'bcryptjs'
import jwt from "jsonwebtoken";


dotenv.config();

const {genSalt,hash: _hash,compare}=bcrypt

//function for hash password

const hashPassword =(password)=>{
    return new Promise((resolve, reject) => {
        genSalt(12,(err,salt)=>{
            if(err) reject(err);
            _hash(password,salt,(err,hash)=>{
                if(err) reject(err);
                resolve(hash)
            })
        })
    })
};

const comparePassword = (password,hashed) =>{
    return compare(password,hashed)
}
const compareMobileNumber = (inputMobile, storedMobile) => {
    return inputMobile === storedMobile;
};


// const authenticate = (req, res, next) => {
    
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.sendStatus(401);
    

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         console.log(err,'is');
        
        

//         console.log("Authenticated user:", user);  // Debugging

//         req.userId = user.id;
//         req.userRole = user.role; // ✅ Store userRole

//         next();
//     });
// };


export default{
    hashPassword,
    comparePassword,
    compareMobileNumber,
    // authenticate
}