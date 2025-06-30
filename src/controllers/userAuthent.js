const User=require('../models/user');
const validate=require('../utils/validate');
const redisClient=require('../Config/redis')

const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const user = require('../models/user');


const register=async (req,res)=>{

        try{
           
            validate(req.body);//function call for the validation 

            const{firstName,emailId,password}=req.body;//destructuring of the object

            const saltRounds = 5;

            req.body.password = await bcrypt.hash(password,saltRounds)
            
            const newuser=  await User.create(req.body);

            const token=jwt.sign(
                    {_id:newuser._id,
                    emailId:emailId,
                    role:'user'},
                    process.env.JWT_KEY,
                    {expiresIn:60*60}
                )
            
            res.cookie('token',token,{maxAge:60*60*1000})
            
            res.status(201).send("User registered successfully");

        }
        catch(err){
            res.status(400).json({
                 message: "User registration failed",
                 error: err.message || "Unknown error occurred"
         });
        }

}

const login=async(req,res)=>{

        try{
               const {emailId,password}=req.body;

                 if (!emailId || !password) {
                    throw new Error("Invalid credentials");
                }

               const user=await User.findOne({emailId});
               console.log(user);
               if(!user)
               {
                    throw new Error("Invalid credentials");
               }

               const match=await bcrypt.compare(password,user.password);
               if(!match)
               {
                    throw new Error("Invalid credentails");
               }

                const token=jwt.sign(
                    {_id:user._id,emailId:emailId,role:user.role},
                    process.env.JWT_KEY,
                    {expiresIn:60*60 }
                );
                    
                  res.cookie('token',token,{maxAge:60*60*1000})

                  res.status(200).send("User loggedin successfully");
        }
        catch(err)
        {
             res.status(400).json({
                 message: "User login failed",
                 error: err.message || "Unknown error occurred"
         });
            
        }
}

const logout=async (req,res)=>{
        
     try{

             const {token} = req.cookies;
             const payload = jwt.decode(token);

             await redisClient.set(`token:${token}`,'Blocked');
             await redisClient.expireAt(`token:${token}`,payload.exp);
   
            res.cookie("token",null,{expires: new Date(Date.now())});

            res.status(200).json({ message: "Logged out successfully" });

     }
    catch (err) {
     res.status(500).json({
        message: "Logout failed",
        error: err.message || "Something went wrong"
    });
    }
}
module.exports={register, login,logout};