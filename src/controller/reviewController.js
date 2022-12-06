const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/booksModel")
const {isValid , isValidName , isValidBookTitle , checkDate} = require('../validator/valid')
const moment = require('moment')
const { json } = require("express")

const createReview = async (req, res) => {
    try {       
        const bookId = req.params.bookId;
        req.body.bookId = bookId
        const bookData = await bookModel.findById(bookId).select({__v:0 , createdAt:0 ,updatedAt:0 , subcategory:0 })
        console.log(bookData)

        if(!bookData){
            return res.status(404).send({ status: false , msg: 'Books not found !'})
        }
        if(bookData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: 'Book Deleted  !'})
        }

        const bookRealeaseDate = new Date(bookData.releasedAt)
        const reviewRealeaseDate = new Date(req.body.reviewedAt)  

        if(reviewRealeaseDate < bookRealeaseDate) return res.status(400).send({ status: false , msg: 'Book Not Released Yet !'})           
        
        const reviewsData = await reviewModel.create(req.body)

        bookData.reviews++
        bookData.save()
        const obj = bookData._doc
        obj.reviewsData =reviewsData
        
        res.status(200).send({ status: true, message: 'Success', data:  obj})
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ******************************************************** Update Review *******************************************************************

const updateReview = async (req, res) => {

    try {
        const reviewId = req.params.reviewId;
        const {reviewsData , bookRealeaseDate} = req

        if(Object.keys(req.body).length==0){
            return res.status(400).send({ status: false, message: 'No Review Data Exist in Body for Update !' })
        }
        const  {reviewedBy ,reviewedAt, rating , review }  = req.body

        if(reviewedBy || reviewedBy=='' ){
            if (!isValidName(reviewedBy) || !isValid(reviewedBy)) {
                return res.status(400).send({status: false, message: "ReviewedBy Name Should be alphabets !" })
            }
        reviewsData.reviewedBy = reviewedBy
        }
        if(reviewedAt || reviewedAt==''){
            if (!checkDate(reviewedAt) || !isValid(reviewedAt)) {
                return res.status(400).send({ status: false, message: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" }) }
            if(bookRealeaseDate < new Date(reviewedAt)){
                return res.status(400).send({ status: false , msg: 'More than Reviewed Date to Book Released Date !'})
            }
           data.reviewedAt = reviewedAt
        }else{
        reviewsData.reviewedAt = moment().format('YYYY-MM-DD')
        }
        if(rating || rating==''){
            if(!/^[1-5]{1}$/.test(rating)){
               return res.status(400).send({status: false, message: " Mandotory Ratting Should be Valid btw { 1 to 5 } only -!" })
            }
        reviewsData.rating = rating    
        }
        if(review || review == ''){
            if(!isValid(review) || !isValidBookTitle(review)){
                return res.status(400).send({status: false, message: "inValid review !" })
            }
        reviewsData.review = review 
        }
        reviewsData.save()

        res.status(200).send({ status: true, message: 'Success', data: reviewsData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// *************************************************************** DElete Review  *****************

const deleteReview = async (req, res) => {
    try {

        const {bookData ,reviewsData} = req
        bookData.reviews--
        reviewsData.isDeleted = true
        bookData.save()
        reviewsData.save()

    res.status(200).send({ status: true, message: 'Success', data: 'Review Deleted Succesfully !' })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createReview, updateReview, deleteReview }

