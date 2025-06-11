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
            
             
            // console.log(result._id);
          const userProblem=  await problem.create({
            ...req.body,
            problemCreator:req.result._id,
        })
       
        res.status(201).send('problem saved successfully');

    }
}
    catch(err){
       res.status(400).send("Error occured "+err)
    }
}
module.exports=problemCreate;
