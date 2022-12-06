const bookModel = require("../models/booksModel")
const reviewModel = require('../models/reviewModel')
const {isValid , isValidObjectIds ,checkDate , isValidBookTitle } = require("../validator/valid")
const moment = require('moment')
const {ErrorHandler }  = require('../validator/ErrorValidation')


const createBook = async (req, res) => {
    try {
        const {title , ISBN , userId , decodedToken} = req.body      
        if(userId !== decodedToken.userId) {
            return res.status(400).send(ErrorHandler(false , "Not Authorized to Create Book!" ))
        }

        const findData = await bookModel.find({$or:[{title : title} ,{ ISBN :ISBN }]})

        for ( let a =0 ; a < findData.length ; a++){
            if(findData[a].title == title){
                return res.status(400).send(ErrorHandler(false , "Title Already Exist !" ))
                        // return res.status(400).send({msg :"Email Already Registered !"})
            }
            if(findData[a].ISBN == ISBN){
                return res.status(400).send(ErrorHandler(false , "ISBN Number Already Exist !" ))
                // return res.status(400).send({msg :"phone Already Registered !"})
            }
        }
        const result = await bookModel.create(req.body)
        return res.status(201).send({ status: true, message: 'Success', data: result })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ************************************  Get Book ***********************************************

const getBook = async (req, res) => {
    try {
        const { category, subcategory, userId } = req.query
        req.query.isDeleted = false 

        if(subcategory){
            if (!isValid(subcategory)) {
                return res.status(400).send(new ErrorHandler(false ,"Enter A Valid Sub Category !" ))
             }}        
        if(category){
            if (!isValid(category)) {
                return res.status(400).send(new ErrorHandler(false ,"Enter A Valid Category !" ))
            }}                  
        if(userId){
             if (!isValidObjectIds(userId)) {
                return res.status(400).send(new ErrorHandler(false ,"Enter Valid User-Id !" ))
            }}        

    const getAllBooks = await bookModel.find(req.query).select(
        { createdAt: 0, updatedAt: 0, __v:0 , address:0 , ISBN:0 , subcategory : 0 ,deletedAt : 0 ,isDeleted : 0  }).sort({title:1}).populate('userId')
        
        if (getAllBooks.length == 0) {
            return res.status(404).send(new ErrorHandler(false , 'Books not found !' ))
        }
        res.status(200).send({ status: true, message: 'Success', data: getAllBooks })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// **************************************************** get book by bookid ***********************************

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Enter book Id" })
        }
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const bookData = await bookModel.findOne({_id : bookId ,isDeleted: false  }).lean().select({ ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 }).sort({title:1}).populate('userId')

        if(!bookData) return res.status(404).send({status :false , message: "Book Not found !" })

        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select(
            { isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 }).sort({ratting:1}) 

        bookData.reviewsData = reviewsData

        return res.status(200).send({ status: true, message: 'Success', data: bookData })
          
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// **************************************************** Update book by bookid ***********************************

const updateBook = async (req, res) => {
    try {
        if (Object.keys(req.body).length < 2){
            return res.status(400).send({ status: false, message: "No data given for updation" })
        } 
        const bookId = req.params.bookId;
        const {title , excerpt ,ISBN , releasedAt } = req.body;
        const updateObj = {}
        
        if(excerpt || excerpt == ''){
            if (!isValidName(excerpt)) {
                return res.status(400).send({status : false , message: "Enter a Valid excerpt !" })   } 
        updateObj.excerpt = excerpt
        }
        if(title || title==''){
            if(!isValid(title) || !isValidBookTitle(title) ){
                return res.status(400).send({ status : false , message: "title Should be Valid! " }) 
            }   
            const checkTitle =await bookModel.findOne({title:title}) 
            if(checkTitle){
                return res.status(400).send({status: false, message :"Title Already Exist !"}) 
            }
            updateObj.title = title
        }
        if(ISBN || ISBN == '') {
            if(!/^[0-9]{8,15}$/.test(ISBN)){
                return res.status(400).send({ status : false , message: "Please Enter valid ISBN Number !" })
            } 
            const isbn=await bookModel.findOne({ISBN:ISBN})
            if(isbn){
                return res.status(400).send({status: false, message :"ISBN Should be Unique !"})  } 
        updateObj.ISBN = ISBN
        }
        if(releasedAt ||releasedAt=='' ){
            if(!checkDate(releasedAt)) {
                return res.status(400).send({ status : false , message: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" }) }
            updateObj.releasedAt = releasedAt
            }

        const result = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateObj }, { new: true })
        res.status(200).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message }) 
    }
}


// **************************************************** Delete book by bookid ***********************************

const deleteBook = async (req, res) => {
    try {
    const bookId = req.params.bookId;
    const result = await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: moment().format('YYYY-MM-DD') } })
      return  res.status(200).send({ status: true, message: "Deleted Successfully" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook , getBook , getBookById , deleteBook ,updateBook  } 