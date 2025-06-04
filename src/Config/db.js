const mongoose = require('mongoose');

async function main() {
     
         await mongoose.connect(process.env.DB_CONNECT_KEY)
         console.log("DB Connected Successfully");
    
}
module.exports=main;