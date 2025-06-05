const User=require('../models/user');
const validate=require('../utils/validate');
const redisClient=require('../Config/redis')

const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const user = require('../models/user');


const saltRounds = 5;
const register=async (req,res)=>{

        try{
            console.log("User authenticatio path");
            validate(req.body);
            const{firstName,emailId,password}=req.body;

            req.body.password = await bcrypt.hash(password,saltRounds)
            
            const newuser=  await User.create(req.body);

            const token=jwt.sign({_id:newuser._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60})
            res.cookie('token',token,{maxAge:60*60*1000})
            res.status(201).send("User registered successfully");

        }
        catch(err){

            res.status(400).send("Error: "+err);
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

            //    console.log('Stored Hash:', user.password);
            //     console.log('Entered Password:', password);

               const match=await bcrypt.compare(password,user.password);
            //    console.log(match);
                    // console.log("Checking login feature");
               if(!match)
               {
                    throw new Error("Invalid credentails");
               }

                const token=jwt.sign(
                    {_id:user._id,emailId:emailId,role:user.role},
                    process.env.JWT_KEY,
                    {expiresIn:60*60 }
                );
                    
                //set cookie and send response
                  res.cookie('token',token,{maxAge:60*60*1000})
                  res.status(200).send("User loggedin successfully");


        }
        catch(err)
        {
             res.status(401).send("Error "+err);
        }
}
//logout features
const logout=async (req,res)=>{
        
     try{

            //token block in the redis
             const {token} = req.cookies;
             const payload = jwt.decode(token);

             await redisClient.set(`token:${token}`,'Blocked');
             await redisClient.expireAt(`token:${token}`,payload.exp);
   

            res.cookie("token",null,{expires: new Date(Date.now())});
            res.send("Logged Out Succesfully");
    }
    catch(err){
       res.status(503).send("Error: "+err);
    }

}
module.exports={register, login,logout};