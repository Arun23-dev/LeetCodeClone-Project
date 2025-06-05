const redisClient = require('../Config/redis');
const User=require('../models/user')
const  jwt = require('jsonwebtoken');
const userMiddleware= async (req,res,next)=>{
    try{
            const {token}=req.cookies;
            if(!token){
                throw new Error("token absent");
            }
            const payload= jwt.verify(token,process.env.JWT_KEY);
            const {_id}=payload;

            if(!_id){
                throw new Error("Invalid token ");
            }
            const result=await User.findById(_id);

            if(!result)
            {
                throw new Error("User doesn't exist");
            }

            //present in blocklist or not
            const isBlocked=await redisClient.exists('token:${token}'); 
            if(isBlocked){
                throw new Error("Invalid token");
            }
            req.result=result;
            next();
            

    }
    catch(err){
        res.send("Error; "+err);
    }
}
module.exports=userMiddleware;