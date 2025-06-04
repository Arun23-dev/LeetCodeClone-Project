const express = require('express');
const main=require('./Config/db');
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cookieParser()); 


main()
    .then(async()=>{
        app.listen(process.env.PORT, () => {
        console.log(`Server is running at port no. ${process.env.PORT}`);
    });


    })
    .catch(error=>console.log("Error occurred: "+ error));



