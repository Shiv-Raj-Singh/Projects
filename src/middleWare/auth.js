const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const { catchAsyncController } = require("../controller/catchController")
const bookModel = require('../models/booksModel')
const reviewModel = require('../models/reviewModel')
const { ErrorHandler } = require("../validator/ErrorValidation")


// ******************************************** AuthentiCation ********************************?

const authentication = catchAsyncController((req, res, next) => {
    const token = req.headers['x-api-key']
    if(!token)  return next(new ErrorHandler('Token Must be Present in Header !' , 400))

    if (token) {
        jwt.verify(token, "book management", (error, decode) => {
            if (error) {
                if (error.message == 'jwt expired') {
                   return next(new ErrorHandler('Your Token has been expired login Again !' , 400))
                }
           return  next(new ErrorHandler('UnAuthenicated Person !' , 401)) }
        req.decodedToken = decode  
            next()
        })  
    }   
})


// // *************************************************** Authorisation *************************

const autherisation =catchAsyncController( async(req,res,next)=>{
    const bookId = req.params.bookId;
    if (!isValidObjectId(bookId) )  return next(new ErrorHandler("Enter Valid Book id !" , 400))
  
    const book = await bookModel.findOne({_id : bookId , isDeleted: false})
    if (!book)  return next(new ErrorHandler("book Not found !" , 404))

    if (book.userId.toString() != req.decodedToken.userId) return next(new ErrorHandler( "Not Authorized !" , 401))
    req.book = book
    next()

}) 


// // ******************************************** *  Update & Deelete Review ****    ***     **    ***    ******* 

const putDeeleteReview =  catchAsyncController(async (req ,res ,next)=>{
    const bookId = req.params.bookId;
    if (!isValidObjectId(bookId) )  return next(new ErrorHandler("Enter Valid Book id !" , 400))
    const bookData = await bookModel.findOne({_id : bookId , isDeleted : false}).select({__v:0 , createdAt:0 ,updatedAt:0 , subcategory:0 })

    if(!bookData) return next(new ErrorHandler("book Not found !" , 404))


    const reviewId = req.params.reviewId;
    if (!isValidObjectId(reviewId) )  return next(new ErrorHandler("Enter Valid Review id !" , 400))

    const reviewsData = await reviewModel.findOne({_id : reviewId , isDeleted : false}).select({__v:0 , createdAt:0 ,updatedAt:0 })

    if(!reviewsData) return next(new ErrorHandler("Review Not found !" , 404)) 
    if(reviewsData.bookId.toString() !==bookId) return next(new ErrorHandler("review-book-id and Book-id diffrents  !" , 400))

    req.bookData = bookData
    req.reviewsData = reviewsData
    req.reviewId = reviewId 
    // req.bookRealeaseDate = bookRealeaseDate  bookData.releasedAt
    next()
})

module.exports = { authentication  , autherisation , putDeeleteReview}