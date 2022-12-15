import { catchController } from "./catchController.js";
import collegeModel from "../models/collegeModel.js";
import { SuccessResonse , ErrorHandler }  from "../utils/AppError.js";
import internModel from "../models/internModel.js";
import { uploadFile } from "../awsConnect.js";

export const createCollege =catchController(async(req , res , next )=>{

    if(Object.keys(req.body).length < 1) next(new ErrorHandler("please enter data in body !" , 400 ) )
    const files = req.files
    if(!files) return next(new ErrorHandler("files Must be Present In Form Data !" , 400 ) )
    if(files.length < 1) return next(new ErrorHandler("files Must be Present In Form Data !" , 400 ) )
   
    const link =  await uploadFile(files[0])  
    req.body.logoLink = link
    
    const data = await collegeModel.create(req.body)
    res.status(201).json(new SuccessResonse(data))
})


export const getCollegeDetails = catchController(async(req , res , next )=>{
    const {collegeName} = req.query
    if(!collegeName) next(new ErrorHandler("Please Enter College Name !" , 400 ) )
    const college = await collegeModel.findOne({name:collegeName}).select('name fullName logoLink').lean()
    if(!college) next(new ErrorHandler("No College Found!" , 404 ) )
    console.log(college)

    const interns = await internModel.find({collegeId : college._id}).select(`name , email , mobile `)
    college.interns = interns
    res.status(201).json(new SuccessResonse(college))
})

