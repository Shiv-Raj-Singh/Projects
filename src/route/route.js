import express from "express"

import { createCollege, getCollegeDetails } from "../controller/college.js";
import { createIntern } from "../controller/intern.js";
import { ErrorHandler } from "../utils/AppError.js";
const router = express.Router();



router.post('/functionup/colleges', createCollege);
router.post('/functionup/interns', createIntern);

router.get('/functionup/collegeDetails', getCollegeDetails);

router.all("/*" , (req , res , next) =>{
    next(new ErrorHandler(`URL- ${req.url} Not Found On Server !` , 404))
    // return res.status(400).send({status:false, msg:"invalid http request !"})
})



export default router