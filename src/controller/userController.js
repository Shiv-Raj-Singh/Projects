const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {isValidEmail,isValidPass , isValid} = require('../validator/valid')
const {ErrorHandler} = require('../validator/ErrorValidation')

const createUser = async (req, res) => {
    try {
        const {phone , email } = req.body
        const findData = await userModel.find({$or:[{phone : phone} ,{ email :email} ]})

        for ( let a =0 ; a < findData.length ; a++){
            console.log(a)
            if(findData[a].email == email){
                return res.status(400).send(ErrorHandler(false , "Email Already Registered !" ))
            } else if(findData[a].phone == phone){
                return res.status(400).send(ErrorHandler(false , "phone Already Registered  !" ))
            }
        }
        const result = await userModel.create(req.body)

        return res.status(201).send({ status: true, message: 'Success', data: result })
        
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const userLogin = async (req, res) => {
try {
    const {email , password} = req.body
    console.log(req.body)

    if (!isValidEmail(email) || !isValid(email)) {
        return res.status(400).send(ErrorHandler(false , "Email Mandatory! && Should be Valid !" ))
    }
    if (!isValidPass(password) ||!password ){
        return res.status(400).send(ErrorHandler(false , "'Password Mandatory ! && Should be Valid Contain only 8 to 15 Charactors !" ))
   }
    const userData = await userModel.findOne({ email: email })
    if(!userData){
        return res.status(404).send({status:false , message : ' User Not Found !'})
    } 
    if(userData.password !== password){
        return res.status(404).send({status:false , message : 'Incorrect Password !'})
    } 
    const token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"24h"})
    const {iat , exp} = jwt.verify(token , "book management")

    return res.status(200).send({ status: true, message: 'Success', data: token , iat : new Date(iat) , exp : new Date(exp) })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin }
