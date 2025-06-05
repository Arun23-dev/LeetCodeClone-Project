require('dotenv').config({ path: '../.env' });
const express = require('express');
const main=require('./Config/db');
const cookieParser = require('cookie-parser')
const authRouter=require('./routes/userAuth');
const redisClient = require('./Config/redis');


const app = express();
app.use(express.json());
app.use(cookieParser()); 


app.use('/user',authRouter);


const initailizeConnection=async ()=>{
    try{
        await  Promise.all([main(), await redisClient.connect()]);
        console.log("DB Connected");

         app.listen(process.env.PORT, () => {
         console.log(`Server is running at port no. ${process.env.PORT}`);

         });
    }
    catch(err){
        console.log("Error "+err);
    }
}
initailizeConnection();
