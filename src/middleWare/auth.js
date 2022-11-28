const jwt = require("jsonwebtoken")
const { isValidName, isValidTitle,isValidPhone, isValidEmail,isValidPass,isValid , isValidBookTitle , isValidObjectIds } = require('../validator/valid')

const userCreateValidation  = function(req,res,next){
    try{
    console.log(req.body)
    if(Object.keys(req.body).length == 0) return res.status(400).send({status : false , message : 'No User Data Exist in Body'})
    const {title , name , phone , email ,password , address } = req.body     
    if (!isValid(name)) {
        return res.status(400).send({ msg: "Enter User Name" })
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
        const {street , city , pincode } = address
        if(street){
            if(!isValidName(street)){
                return res.status(400).send({ msg: "Please Enter valid Street Name !" })
            }  }
        if(city){
            if(!isValidName(city)){
                return res.status(400).send({ msg: "Please Enter valid City Name !" })
            }  }
        if(pincode){
            if(!/^[0-9]{6}$/.test(pincode)){
                return res.status(400).send({ msg: "Please Enter valid Pin-Code !" })
            }  }
        }

    next()
}
catch(error) {
    res.status(500).send({status:false , message : error.message})
}
}


//  **********************************************************  Book Creation  Validation *****************


const bookCreateValidation  = function(req,res,next){
    try{
    console.log(req.body)
    if(Object.keys(req.body).length == 0) return res.status(400).send({status : false , message : 'No User Data Exist in Body'})
    const {title , excerpt , userId , ISBN ,category ,subcategory , releasedAt } = req.body     
    if (!isValid(excerpt)) {
        return res.status(400).send({ msg: "Enter User Excerpts !" })
    }
    if (!isValidName(excerpt)) {
        return res.status(400).send({ msg: "excerpt only take alphabets !" })
    }
    if (!isValid(title)) {
        return res.status(400).send( {status : false, msg: "Enter Title Name for Book !" })
    }
    if (!isValidBookTitle(title)) {
        return res.status(400).send({ status : false , msg: "Enter a Valid title ! " })
    }
    if (!isValid(userId)) {
        return res.status(400).send({status : false , msg: "Enter User-Id !" })
    }
    if (!isValidObjectIds(userId)) {
        return res.status(400).send({ status : false,msg: "enter a Valid User Id !" })
    }
    if(!ISBN) return res.status(400).send({status : false , message : 'ISBN is Mandatory !'})


    if(!category) return res.status(400).send({status : false,  msg: "Enter The Category !" })

    if(!isValidBookTitle(category))  return res.status(400).send({status : false , msg: "Please Enter valid Category !" })

    if(!subcategory) return res.status(400).send({ status : false , msg: "Enter The Sub-Category !" })

    if(!isValidBookTitle(subcategory))  return res.status(400).send({status : false , msg: "Please Enter valid Sub-Category !" })
    
    if(!ISBN) return res.status(400).send({ status : false ,msg: "Please Enter ISBN Number !" })
    if(!/^[0-9]{8,15}$/.test(ISBN)){
        return res.status(400).send({ status : false , msg: "Please Enter valid ISBN Number !" })
    }  

    req.body.releasedAt = new Date()

    next()
}
catch(error) {
    res.status(500).send({status:false , message : error.message})
}
}

// ******************************************** AuthentiCation ********************************?

let authentication = (req, res, next)=>{
    try{ 
        const token=req.headers['x-api-key']
        if(token){
            jwt.verify(token,"book management" , (error , decode)=>{
                if(error) {
                    if(error.message =='jwt expired'){
                        return res.status(400).send({status:false, message : 'Your Token has been expired login Again' })
                    }
                }
                else {
                    req.decodedToken=decode
                }
                next()
            })   }
        else res.status(404).send({status:false,msg:"Token is missing"})
    }
    catch(err){
        return res.status(500).send({status:false, Error:err.message})
    }
}



module.exports = {authentication , userCreateValidation , bookCreateValidation}


