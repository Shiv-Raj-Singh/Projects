const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/booksModel")
const moment = require('moment')
const { catchAsyncController } = require("./catchController")
const { isValidObjectId } = require("mongoose")
const { reviewSchema, updatereviewSchema } = require("../models/joiSchema")
const { ErrorHandler } = require("../validator/ErrorValidation")

// ***************************************  Review Create ***********************************


const createReview = catchAsyncController(async (req ,res , next )=>{
    const bookId = req.params.bookId;
    if(Object.keys(req.body).length < 1) next (new ErrorHandler(`No Such Data for review Updation !` , 400))
    if( !isValidObjectId(bookId)) next (new ErrorHandler(`Enter A Valid Book-Id ${bookId} !` , 400))

    const bookData = await bookModel.findOne({_id : bookId , isDeleted : false}).select({__v:0 , createdAt:0 ,updatedAt:0 , subcategory:0 })
    if(!bookData)  next (new ErrorHandler(`No Book found by id !` , 404))
    req.body.bookId = bookId

    const reviewData = await reviewSchema.validateAsync(req.body)   // Validation For Review Data 

    const bookRealeaseDate = new Date(bookData.releasedAt)
    const reviewRealeaseDate = new Date(reviewData.reviewedAt)  

    if(reviewRealeaseDate < bookRealeaseDate) return next (new ErrorHandler(`Book Not Released Yet !` , 400))  
    const reviewsData = await reviewModel.create(req.body)
    console.log(bookData.reviews)
    bookData.reviews++
    bookData.save()
   
    const obj = bookData._doc
    obj.reviewsData =reviewsData
    console.log(bookData)
        
    res.status(201).send({ status: true, message: 'Success', data:  obj})
})


// ******************************************************** Update Review **************************************

const updateReview = catchAsyncController(async (req ,res ,next)=>{
    if(Object.keys(req.body).length < 1) next (new ErrorHandler(`No Such Data for review Updation !` , 400))
    const reviewUpdateData = await updatereviewSchema.validateAsync(req.body)
    if(!reviewUpdateData.reviewedAt) reviewUpdateData.reviewedAt = moment().format('YYYY-MM-DD')
    const updateData = await reviewModel.findByIdAndUpdate(req.reviewId  , {$set :reviewUpdateData} , {new : true })
    res.status(200).send({ status: true, message: 'Success', data: updateData })
})


// **********************************         DElete Review  *** *************       **************

const deleteReview = catchAsyncController(async (req ,res )=>{
    const {bookData ,reviewsData} = req
    bookData.reviews--
    reviewsData.isDeleted = true
    bookData.save()
    reviewsData.save()
    res.status(200).send({ status: true, message: 'Success', data: 'Review Deleted Succesfully !' })   
})

module.exports = { createReview, updateReview, deleteReview }

