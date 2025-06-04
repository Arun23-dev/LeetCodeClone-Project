
const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema= new Schema({
        firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
        },
        lastName:{
            type:String,
            required:true,
            minLength:3,
            maxLength:20,
        },
        emailId:{
            type:String,
            required:true,
            maxLength:30,
            unique:true,
            trim:true,
            lowercase:true,
            immutable:true,
        },
        age:{
            type:Number,
            min:5,
            max:80,
        },
        role:{
            type:String,
            enum:['user','admin'],
            default:'user',
        },
        problemSolved:{
            type:[String],
        },
        password:{
            typeof:String,
            required:true,
            minLength:7,
            trim:true,
            select:false,
        },
        image:[{
             data:Buffer,
             contentType:String,
        }],
        },
        {
        timestamps: true, 
        }       
);
const User=mongoose.model('user',userSchema);
module.exports=User;