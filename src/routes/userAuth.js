const express=require('express');
const {register,login,logout}=require('../controllers/userAuthent');
const authRouter=express.Router();
const userMiddleware=require('../middleware/userMiddleware');


//user signup
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',userMiddleware,logout);
// authRouter.post('/getprofile',getprofile);

module.exports=authRouter;

