const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {ErrorHandler} = require('../validator/ErrorValidation')
const { userSchema , loginSchema} = require("../models/joiSchema")
const { catchAsyncController } = require("./catchController")


// ************************************************ Usere Register *************************************

const createUser = catchAsyncController(async (req , res , next)=>{
    const userData = await userSchema.validateAsync(req.body)
    const result = await userModel.create(userData)
    return res.status(201).send({ status: true, message: 'Success', data: result })
})


// **************************************************  Login User **************************************

const userLogin = catchAsyncController( async (req ,res , next)=>{
    const loginData = await loginSchema.validateAsync(req.body)
    const userData = await userModel.findOne({ email: loginData.email })

    if(!userData)  return next(new ErrorHandler(`User Not Found !` , 404))
    if(userData.password !== loginData.password) return next( new ErrorHandler('Incorrect Password !' , 400))

    const token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"24h"})
    const {iat , exp} = jwt.verify(token , "book management")

    return res.status(200).send({ status: true, message: 'Success', data: token , iat : new Date(iat) , exp : new Date(exp) })

})

module.exports = { createUser, userLogin }
