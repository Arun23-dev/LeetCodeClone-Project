const User=require('../models/user');
const problem=require('../models/problem');
const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility');

const problemCreate=async (req,res) => {
    const {
            title,
            description,
            difficultyLevel,
            tags,
            visibleTestCases,
            hiddenTestCases,
            starterCode,
            referenceSolution,
            }=req.body;
    try{


        const isproblemExistByTitle=await problem.findOne({title:req.body.title});
        if(isproblemExistByTitle)
        {
            return res.status(400).json(
                {
                    message:"Problem with this title already exists",
                    error:"Duplicate problem title",
                }
            )
        }
        const problemExistByDescription = await problem.findOne({ description:req.body.description});
        if(problemExistByDescription)
        {
            return res.status(400).json(
                {
                    message:"problem with this description already exist",
                    error:"Duplicate  problem Description "
                }
            )
        }

        for(const {language,completeCode} of referenceSolution){
           
            const languageId=getLanguageById(language); 

            const submissions=visibleTestCases.map((testcases,index)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcases.input,
                expected_Output:testcases.output,

            }));
            const submitResult=await submitBatch(submissions);

            const tokenResult=  submitResult.map((value)=>value.token);

            const testResult= await submitToken(tokenResult);

            console.log(testResult);
            for(const test of testResult)
            {
                if(test.status_id!==3)
                {
                  return res.status(400).send("Error Occurred  here in testcase");
                }

            }
            
          const userProblem=  await problem.create({
            ...req.body,
            problemCreator:req.result._id,
        })
       
        res.status(201).send('problem saved successfully');

    }
}
    catch(err){
       
        res.status(500).json({
            message: "Problem not saved successfully",
            error:err.message
        });
    }
}
const problemUpdate=async(req,res)=>{
    
     const {
            title,
            description,
            difficultyLevel,
            tags,
            visibleTestCases,
            hiddenTestCases,
            starterCode,
            referenceSolution,
            }=req.body;
    try{

        const {id}=req.params;

        if(!id)
        {
            return res.status(400).json(
                {
                    message:'Missing Id parameter',
                    error:"id is not defined"
                }
            )
        }

        const dsaProblem= await User.findById(id);

        if(!dsaProblem)
        {
            return res.status(404).json(
                {
                    message:"User not found",
                    error:"userid does not exist"
                }
            )
        }
        

        for(const {language,completeCode} of referenceSolution){
           
            const languageId=getLanguageById(language); 

            const submissions=visibleTestCases.map((testcases,index)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcases.input,
                expected_Output:testcases.output,

            }));
            const submitResult=await submitBatch(submissions);

            const tokenResult=  submitResult.map((value)=>value.token);

            const testResult= await submitToken(tokenResult);

            for(const test of testResult)
            {
                if(test.status_id!==3)
                {
                  return res.status(400).send("Error Occurred ");
                }
            }
           const newProblem= await User.findOneAndUpdate(id,{...req.body},{validator:true ,new:true})
            
           res.status(200).send(newProblem);

         }
    }
    catch(err){
      return  res.status(500).json({
            error:err.message
        });
    }
}
const problemDelete=async(req,res)=>{

    const {id}=req.params;

    try{

        if(!id)
        {
            return res.status(400).json(
                {
                    message:'Missing Id parameter',
                    error:"id is not defined"
                }
            )}
         const deletedProblem=await problem.findByIdAndDelete(id);
         if(!deletedProblem)
         {
            return res.status(400).send(`Problem doesn't exist with the ${id}`);
         }
         res.status(200).send('problem deleted successfully');


    }
    catch(error)
    {
        res.status(500).send('Error '+error.message);

    }
   


}
const  getProblemById=async(req,res)=>{

    try{
    const {id}=req.params;
    if(!id){
        return  res.status().send("Invalid parameter");
    }

    const fetchedProblem=await problem.findById(id);

    if(!fetchedProblem)
    {
        return res.status(404).send(`problem doesn't exist with the ${id}`);
    }
    res.status(200).send(fetchedProblem);
    }
    catch(error)
    {
        res.status(500).send("Error "+error.message);
    }
}
const getAllProblem=async(req,res)=>{

    try{
        const limit=10;
        const page=1;
        const offset=(page-1)*limit;
        const fetchedProblem =await problem.find({}).skip(offset).limit(limit)

        if(fetchedProblem.length===0)
        {
            return res.status(404).send('Problem missing ');
        }
        return res.status(200).send(fetchedProblem);
    }
    catch(error)
    {
        res.status(400).send("Error "+error.message);
    } 
}
module.exports={problemCreate,problemUpdate,problemDelete,getProblemById,getAllProblem};
