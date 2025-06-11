const mongoose=require('mongoose');
const  user= require('./user');
const {Schema}=mongoose;

const problemSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    difficultyLevel:{
        type:String,
        required:true,
        enum:["easy","medium","hard"],
    },
    tags:{
        type:String,
        requird:true,
        enum:["array",'string',"db","graph"],
    },
    visibleTestCases:[
        {
            input:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        },
        explanation:{
            type:String,
            required:true,
        }
    }
    ],
    hiddenTestCases:[
        {input:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        }
    }
    ],
    starterCode:[
        {
            language:{
                type:String,
                required:true,
                // enum:['C++','C','Java','Python','Javascript','Kotlin'],
            },
            initialCode:{
                type:String,
                required:true,

            }
        }
    ],
    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
             completeCode:{
                type:String,
                required:true,

            }

        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }
    
}

)
const problem=mongoose.model('problem',problemSchema)
module.exports=problem;