
import collegeModel from "../models/collegeModel.js";
import internModel from "../models/internModel.js";
import { ErrorHandler, SuccessResonse } from "../utils/AppError.js";
import { catchController } from "./catchController.js";



export const createIntern = catchController(async (req , res , next)=>{
    console.log((req.body))
    if(Object.keys(req.body).length < 1)  return next(new ErrorHandler("No Data for interns !" , 400))
    if(!req.body.collegeName)  return next(new ErrorHandler("college name required !" , 400))

    const findCollege = await collegeModel.findOne({$or : [{name:req.body.collegeName } , {fukkName : req.body.collegeName}] })
    if(!findCollege) return next(new ErrorHandler(`College Name -> (${req.body.collegeName}) Does Not Exist !` ,400))

    // console.log(Object.keys(req.body))
    const data = await internModel.create(req.body)
    res.status(201).json(new SuccessResonse(data))
    
    // intern.save().then

})