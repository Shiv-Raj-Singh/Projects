const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {isValidEmail,isValidPass} = require('../validator/valid')

const createUser = async (req, res) => {
    try {
        const {phone , email } = req.body

        const checkEmail=await userModel.findOne({email:email})
        if(checkEmail) return res.status(400).send({msg :"Email Already Registered !"})

        const checkEMobile=await userModel.findOne({phone:phone})
        if(checkEMobile) return res.status(400).send({msg :"phone Number Already Registered !"})

        const result = await userModel.create(req.body)
        res.status(201).send({ status: true, message: 'Success', data: result })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const {email , password} = req.body
        if(Object.keys(req.body).length == 0 ) return res.status(400).send({status : false , message : 'No User Data Exist in Body'})

        if(!email) return res.status(400).send({status : false , message : 'Email Mandatory !'})
        if(!password) return res.status(400).send({status : false , message : 'Password Mandatory !'})

        if(!isValidEmail(email))  return res.status(400).send({status : false , message : 'inValid Email !'})
        if(!isValidPass(password)) return res.status(400).send({status : false , message : 'inValid Password !'})

        if(password.length < 8 || password.length > 15  ) 
        return res.status(400).send({status : false , message : 'Password Must be Contain Min 8 or Max 15 Charactors !'})
        
        const userData = await userModel.findOne({ email: email, password: password })

        if(!userData) return res.status(400).send({status:false , message : ' User Not Found '})

        const token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"10s"})
        const {iat , exp} = jwt.verify(token , "book management")

        res.status(200).send({ status: true, message: 'Success', data: token , iat : iat , exp : exp })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin }
