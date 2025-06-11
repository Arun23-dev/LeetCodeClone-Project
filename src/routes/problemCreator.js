
const express=require('express');
const problem = require('../models/problem');
const problemRouter=express.Router();
const problemCreate=require('../controllers/userProblem');
const adminMiddleware = require('../middleware/adminMiddleware');



problemRouter.post('/create',adminMiddleware,problemCreate);
// problemRouter.patch('/:id',adminMiddleware,updateProblem);
// problemRouter.delete('/:id',adminMiddleware,deleteProblem);


// problemRouter.get('/:id',verifyMiddleware,);
// problemRouter.get('/',verifyMiddleware,problemAllfetch);
// problemRouter.get('/user',problmeSolved);


module.exports=problemRouter;