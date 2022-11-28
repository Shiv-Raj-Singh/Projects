// const jwt = require("jsonwebtoken")
// const { isValidName, isValidTitle,isValidPhone, isValidEmail,isValidPass,isValid } = require('../validator/valid')

// function userCreateValidation(req , res ,next) {
// try {
//     console.log(req.body)
//     if(Object.keys(req.body).length == 0 ) return res.status(400).send({status : false , message : 'No User Data Exist in Body'})
//     const {title , name , phone , email ,password , address :{street,city,pincode }} = req.body     
//     if (!isValid(name)) {
//         return res.status(400).send({ msg: "Enter First Name" })
//     }
//     if (!isValidName(name)) {
//         return res.status(400).send({ msg: "Name only take alphabets" })
//     }
//     if (!isValid(title)) {
//         return res.status(400).send({ msg: "Enter Title Name" })
//     }
//     if (!isValidTitle(title)) {
//         return res.status(400).send({ msg: "Enter title from this ['Mr', 'Mrs', 'Miss']" })
//     }
//     if (!isValid(email)) {
//         return res.status(400).send({ msg: "Enter Email-Id" })
//     }
//     if (!isValidEmail(email)) {
//         return res.status(400).send({ msg: "enter valid email" })
//     }
//     if(!password) return res.status(400).send({status : false , message : 'Password Mandatory !'})

//     if(password.length < 8 || password.length > 15  ) 
//     return res.status(400).send({status : false , message : 'Password Must be Contain Min 8 or Max 15 Charactors !'})

//     if(!isValidPass(password)) return res.status(400).send({status : false , message : 'inValid Password !'})

//     if(!phone) return res.status(400).send({ msg: "Enter The Phone Number !" })

//     if(!isValidPhone(phone))  return res.status(400).send({ msg: "Please Enter valid Phone Number !" })

//     if(address){
//         if(street){
//             if(!isValidName(street)){
//                 return res.status(400).send({ msg: "Please Enter valid Street Name !" })
//             }  }
//         if(city){
//             if(!isValidName(city)){
//                 return res.status(400).send({ msg: "Please Enter valid City Name !" })
//             }  }
//         if(pincode){
//             if(!isValidName(pincode) || !/^[0-9]{6}$/.test(pincode)){
//                 return res.status(400).send({ msg: "Please Enter valid Pin-Code !" })
//             }  }
//     } 

//     next()
// }

// catch(error) {
//     res.status(500).send({status:false , message : error.message})
// }
// }

// let authentication = (req, res, next)=>{
//     let token = req.headers["x-api-key"]

//     jwt.verify(token, "book management", (err, decode)=>{
//         console.log(err, decode)
//         if(err){return res.status(401).send({status:false, message:"Authenitication failed"})}
//         if(decode){
//             req.decode = decode
//             next()
//         }
//     })
// }

// // let autherisation = (req, res, next)=>{
      
// // }
// module.exports = {authentication , userCreateValidation}


