const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')
const moment = require('moment')
const {ErrorHandler }  = require('../validator/ErrorValidation')
const { catchAsyncController } = require("./catchController")
const { bookSchema , getBookSchema, updateSchema } = require("../models/joiSchema")
const { isValidObjectId } = require("mongoose")
const {fileUpload} = require('../middleWare/awsfileUpload.js')


const createBook = catchAsyncController(async (req, res,next) => {
    if(!req.files)   return next(new ErrorHandler(`Book-Cover Must be Present  !` , 400))
    const url =  await fileUpload(req.files[0])

    req.body.bookCover = url 
    const bookData = await bookSchema.validateAsync(req.body)

    if(!isValidObjectId(bookData.userId)) return next(new ErrorHandler(`Please Enter A Valid UserId !` , 400))
    if(bookData.userId !== req.decodedToken.userId) return next(new ErrorHandler(`Not Authorized to Create Book!` , 401))

    const result = await bookModel.create(req.body)
    return res.status(201).send({ status: true, message: 'Success', data: result })
  
})

// ************************************  Get Book ***********************************************

const getBook = catchAsyncController(async(req,res,next)=>{
    const queryFilter = await getBookSchema.validateAsync(req.query)
    queryFilter.isDeleted = false 

    const getAllBooks = await bookModel.find(queryFilter).select('title , excerpt, userId,category ,reviews , releasedAt').sort({title:1}).populate('userId')
    
    if (getAllBooks.length == 0) {
        return next(new ErrorHandler('Books not found !' , 404 ))
    }
    res.status(200).send({ status: true, message: 'Success', data: getAllBooks })
})



// **************************************************** get book by bookid ***********************************

const getBookById = catchAsyncController(async(req,res,next)=>{
    const bookId = req.params.bookId;
    if (!isValidObjectId(bookId) )  return next(new ErrorHandler("Enter Valid Book id !" , 400))
    
    const bookData = await bookModel.findOne({_id : bookId ,isDeleted: false  }).lean().select('title  excerpt userId category  reviews  releasedAt').sort({title:1}).populate('userId')

    if(!bookData) return res.status(404).send({status :false , message: "Book Not found !" })

    const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select('bookId reviewedBy review rating').sort({ratting:1}) 
    bookData.reviewsData = reviewsData

    return res.status(200).send({ status: true, message: 'Success', data: bookData })
})


// **************************************************** Update book by bookid ***********************************

const updateBook = catchAsyncController( async(req,res,next)=>{
    const updateData = await updateSchema.validateAsync(req.body) 
    if(Object.keys(updateData).length < 1) return next(new ErrorHandler('No Data for Updation !' , 400))  
    const result = await bookModel.findOneAndUpdate({ _id: req.book._id }, { $set: updateData }, { new: true })
    res.status(200).send({ status: true, message: 'Success', data: result })
    
}) 

// **************************************************** Delete book by bookid ***********************************

const deleteBook = catchAsyncController(async(req ,res , next)=>{
    const result = await bookModel.findByIdAndUpdate({ _id: req.book._id }, { $set: { isDeleted: true, deletedAt: moment().format('YYYY-MM-DD') } })
    return  res.status(200).send({ status: true, message: "Deleted Successfully" })
})



module.exports = { createBook , getBook , getBookById , deleteBook ,updateBook  } 