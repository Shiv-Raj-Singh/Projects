const jwt = require("jsonwebtoken")
const moment = require("moment/moment")
const bookModel = require('../models/booksModel')
const reviewModel = require('../models/reviewModel')
const { isValidName, isValidTitle, isValidPhone,
         isValidEmail, isValidPass, isValid,
         isValidBookTitle, isValidObjectIds, checkDate } = require('../validator/valid')

const {fileUpload} = require("../middleWare/awsfileUpload")

// const awsfileUpload = (req , res ){
//     const files = req.files
//     if(!files) return res.status(404).send({status :false , message : "files Must be Present !"})
//     const url = await fileUpload(files)
//     req.body.bookCover = url 
//     console.log(url)
  
// }

const userCreateValidation = function (req, res, next) {
try {
    if (Object.keys(req.body).length == 0){
        return res.status(400).send({ status: false, message: 'No User Data Exist in Body' })
    }
    const { title, name, phone, email, password, address } = req.body

    if (!isValidName(name) || !isValid(name)) {
        return res.status(400).send({status: false, message: "Name Mandatory! && Should be in Alphabets !"})
    }
    if (!isValidTitle(title) || !isValid(title)) {
        return res.status(400).send({status: false, message: "title Mandatory! && Should be like this ['Mr', 'Mrs', 'Miss'] !" })
    }
    if (!isValidEmail(email) || !isValid(email)) {
        return res.status(400).send({ status: false, message: "Email Mandatory! && Should be Valid !" })
    }
    if (!isValidPass(password) ||!password ){
         return res.status(400).send({ status: false, message: 'Password Mandatory ! && Should be Valid Contain only 8 to 15 Charactors !' })
    }
    if (!isValidPhone(phone) || !phone){
        return res.status(400).send({status: false, message: "Phone Number Mandatory! && Should be Valid !" })
    }
    if(address && (typeof address !== "object" || Object.keys(address).length == 0  )) {
        return res.status(400).send({status: false, message: "Address Should be An Object && Not be Empty !" })
    }
    if (address) {
        const { street, city, pincode } = address
        if(city){
            if (!isValidName(street) || !isValidName(city)) {
                return res.status(400).send({status: false, message: "Please Enter valid City Name !" })
            }
        if (street) {
            if (!isValidName(street) || !isValidName(city)) {
                return res.status(400).send({status: false, message: "Please Enter valid Street Name !" })
            }
        if(pincode)
            if (!/^[0-9]{6}$/.test(pincode)) {
                return res.status(400).send({ status: false, message: "Please Enter valid Pin-Code !" })
            }
           }}}

    next()
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//  **********************************************************  Book Creation  Validation *****************

const bookCreateValidation = async function (req, res, next) {
    try {
        // console.log(req.body)
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'No User Data Exist in Body' })
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

      const files = req.files
        if(!files) return res.status(404).send({status :false , message : "files Must be Present !"})
        // console.log(req.files)
        const url =  await fileUpload(files[0])

        req.body.bookCover = url 

        if (!isValidName(excerpt) || !isValid(excerpt)) {
            return res.status(400).send({status: false, msg: "Excerpt Mandatory! && Should be in Alphabets !" })
        }
        if (!isValidBookTitle(title) || !isValid(title) ) {
            return res.status(400).send({ status: false, msg: "Title Mandatory! && Should be Valid ! " })
        }
        if (!isValidObjectIds(userId) || !userId) {
            return res.status(400).send({ status: false, msg: "User-Id Mandatory! && Should be Valid !" })
        }
        if (!isValidBookTitle(category) || !category){
            return res.status(400).send({ status: false, msg: "category Mandatory! && Should be Valid  !" })
        } 
        if (!isValidBookTitle(subcategory || !subcategory)) {
            return res.status(400).send({ status: false, msg: "Sub-Category Mandatory! && Should be Valid !" })
        }    
        if (!/^[0-9]{8,15}$/.test(ISBN) || !ISBN) {
            return res.status(400).send({ status: false, msg: "ISBN NUmber Mandatory! && Should be Valid !" })
        }
        if (!checkDate(releasedAt) || !releasedAt) {
            return res.status(400).send({ status: false, msg: "ReleasedAt Mandatory ! && Should be like this-[ YYYY-MM-DD ] !" })
        }
   next()
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ******************************************** AuthentiCation ********************************?

const authentication = (req, res, next) => {
try {
    const token = req.headers['x-api-key']

    if(!token)  return res.status(400).send({ status: false, message: "Token is missing" })

    if (token) {
        jwt.verify(token, "book management", (error, decode) => {
            if (error) {
                if (error.message == 'jwt expired') {
                    return res.status(400).send({ status: false, message: 'Your Token has been expired login Again' })
                }else{
                    return res.status(401).send({ status: false, message: "Authenitication failed" })
                } 
            }
            req.body.decodedToken = decode  
            next()
        })  
    }   
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message }) 
    }
}

// *************************************************** Authorisation *************************

const autherisation = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;

        if (!isValidObjectIds(bookId) || !bookId) {
            return res.status(400).send({ status: false, message: "Book-Id Mandatory! && Should be Valid " })
        }
        const user = await bookModel.findById(bookId)
        if (!user){
            return res.status(404).send({ status: false, message: "InCorrect Book id !" })
        } 
        if (user.isDeleted == true){
            return res.status(400).send({ status: false, message: "Book Already Deleted !" })
        }
        if (user.userId.toString() !== req.body.decodedToken.userId) {
            return res.status(403).send({ status: false, message: "Not Authorized !" })
        }
    
    next()

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


// *******    *** **** **   ***************** Review Create *******     *******    *******   ********     **********

const reviewCreateValidation = function(req , res , next ){
    try {
        const bookId = req.params.bookId
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        if(Object.keys(req.body).length==0){
            return res.status(400).send({ status: false, message: 'No Review Data Exist in Body' })
        }
        const {reviewedBy ,reviewedAt, rating , review } = req.body

        if(reviewedBy){
            if (!isValidName(reviewedBy) || !isValid(reviewedBy)) {
                return res.status(400).send({status: false, message: "ReviewedBy Name Should be Alphabets !" })
            }
        }else{
            req.body.reviewedBy = 'Guest'
        }
        if(reviewedAt){
            if (!checkDate(reviewedAt) || !isValid(reviewedAt)) {
                return res.status(400).send({ status: false, message: "reviewedAt Should be like this-[ YYYY-MM-DD ]!" }) }
        }else{
            req.body.reviewedAt = moment().format('YYYY-MM-DD')
        }
        if(!rating || !isValid(rating) || !/^[1-5]{1}$/.test(rating) ){
            return res.status(400).send({status: false, message: "Rating Mandatory ! && Not be 0 ! && Should be Valid btw { 1 to 5 } !" })
        }
        if(review){
            if(!isValid(review) || !isValidBookTitle(review)){
                return res.status(400).send({status: false, message: "inValid review !" })
            }
        }
    
    next()
    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

// ******************************************** *  Update & Deelete Review ****    ***     **    ***    ******* 

const putDeeleteReview =  async (req,res ,next)=>{
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const bookData = await bookModel.findById(bookId).select({__v:0 , createdAt:0 ,updatedAt:0 , subcategory:0})
        console.log(bookData.releasedAt)
        const bookRealeaseDate = bookData.releasedAt
        if(!bookData){
            return res.status(404).send({ status: false , msg: 'Books not found !'})
        }
        if(bookData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: ' your Book is Deleted !'})
        }    
        const reviewId = req.params.reviewId;
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const reviewsData = await reviewModel.findById(reviewId)
        if(reviewsData.bookId.toString()  !==bookId){
            return res.status(404).send({ status: false , msg: 'Book-id is not match by review bookid !'})
        }
        if(!reviewsData){
            return res.status(404).send({ status: false , msg: 'No review found !'})
        }
        if(reviewsData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: 'Review is Already Deleted !'})
        }
       
        req.bookData = bookData
        req.reviewsData = reviewsData
        req.bookRealeaseDate = bookRealeaseDate

    next()

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


module.exports = { authentication, userCreateValidation, bookCreateValidation,reviewCreateValidation, autherisation ,putDeeleteReview }