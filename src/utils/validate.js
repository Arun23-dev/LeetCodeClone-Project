const  Validator = require('validator');
const validate=(data)=>{

    const mandatoryField=['firstName','emailId', 'password'];
    const isAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed){
        console.log("Hello");
        throw new Error("Field missing");
    }
    if(!Validator.isEmail(data.emailId)){
        throw new Error("Invalid email");
    }
    if(!Validator.isLength(data.firstName,{min:3,max:20}))
    {
        throw new Error("Enter proper lenght of the name");
    }
    if(!Validator.isStrongPassword(data.password)){
        throw new Error("Please enter the strong password")
    }

}
module.exports=validate;