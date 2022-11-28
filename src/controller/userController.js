const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {isValidEmail,isValidPass} = require('../validator/valid')

const createUser = async (req, res) => {
    try {
        // const {phone , email } = req.body

        console.log(req.body)
        if (Object.keys(req.body).length < 1) return res.status(400).send({ msg: "enter the data" })
        // if(Object.keys(req.body).length == 0 ) return res.status(400).send({status : false , message : 'No User Data Exist in Body'})
        const {title , name , phone , email ,password , address :{street,city,pincode }} = req.body     
        if (!isValid(name)) {
            return res.status(400).send({ msg: "Enter First Name" })
        }
        if (!isValidName(name)) {
            return res.status(400).send({ msg: "Name only take alphabets" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ msg: "Enter Title Name" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ msg: "Enter title from this ['Mr', 'Mrs', 'Miss']" })
        }
        if (!isValid(email)) {
            return res.status(400).send({ msg: "Enter Email-Id" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ msg: "enter valid email" })
        }
        if(!password) return res.status(400).send({status : false , message : 'Password Mandatory !'})
    
        if(password.length < 8 || password.length > 15  ) 
        return res.status(400).send({status : false , message : 'Password Must be Contain Min 8 or Max 15 Charactors !'})
    
        if(!isValidPass(password)) return res.status(400).send({status : false , message : 'inValid Password !'})
    
        if(!phone) return res.status(400).send({ msg: "Enter The Phone Number !" })
    
        if(!isValidPhone(phone))  return res.status(400).send({ msg: "Please Enter valid Phone Number !" })
    
        if(address){
            if(street){
                if(!isValidName(street)){
                    return res.status(400).send({ msg: "Please Enter valid Street Name !" })
                }  }
            if(city){
                if(!isValidName(city)){
                    return res.status(400).send({ msg: "Please Enter valid City Name !" })
                }  }
            if(pincode){
                if(!isValidName(pincode) || !/^[0-9]{6}$/.test(pincode)){
                    return res.status(400).send({ msg: "Please Enter valid Pin-Code !" })
                }  }
        } 
    
    
        const checkEmail=await authorModel .findOne({email:email})
        if(checkEmail) return res.status(400).send({msg :"Email Already Registered !"})

        const checkEMobile=await authorModel .findOne({phone:phone})
        if(checkEMobile) return res.status(400).send({msg :"phone Number Already Registered !"})
        const result = await userModel.create(data)
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

        const token = jwt.sign({ userId: userData._id }, "book management", {expiresIn:"60s"})

        res.status(200).send({ status: true, message: 'Success', data: token })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin }
