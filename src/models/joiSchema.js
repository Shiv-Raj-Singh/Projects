const joi = require("joi")

 const userSchema = joi.object({
    title : joi.string().required().trim().valid('Mr' , 'Mrs' , "Miss"),
    name : joi.string().required().trim().regex(/^[a-zA-Z( \)]*$/).min(3).max(25),
    phone : joi.string().required().trim().min(10).max(10).regex(/^[(6-9){1}0-9]*$/),
    email : joi.string().required().trim().email(),
    password : joi.string().required().trim().min(8).max(15).regex(/^[a-zA-Z0-9]*$/),
    address : joi.object().keys({
        street: joi.string().optional().trim().regex(/^[a-zA-Z0-9( ,\)]*$/),
        city: joi.string().optional().trim().regex(/^[a-zA-Z0-9( ,\)]*$/) ,
        pincode:joi.string().optional().trim().min(6).max(6).regex(/^[0-9]*$/) ,
    }) 
 })

// ********************************************************  Book Schema  *****************************
const bookSchema = joi.object({
    bookCover : joi.string().required(),
    title : joi.string().required().trim().min(3).max(30).regex(/^[a-zA-Z0-9( ,\)]*$/) ,
    excerpt : joi.string().required().trim().min(3).max(30).regex(/^[a-zA-Z0-9( ,\)]*$/) ,
    userId : joi.string().required().trim(),
    ISBN : joi.string().required().trim().min(10).max(13).regex(/^[0-9]*$/) ,
    category :joi.string().required().trim().min(3).max(30).regex(/^[a-zA-Z( ,\)]*$/) ,
    subcategory :joi.string().required().trim().min(3).max(30).regex(/^[a-zA-Z( ,\)]*$/) ,
    reviews : joi.number().optional(),
    isDeleted : joi.boolean().optional(),
    releasedAt : joi.string().required().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])*$/ ) ,
    deletedAt : joi.string().optional().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])*$/ )
})

// ******************************************* Login User ***********************************

const loginSchema = joi.object({
    email : joi.string().required().trim().email(),
    password : joi.string().required().trim().min(8).max(15).regex(/^[a-zA-Z0-9]*$/),
 })
   
// **********************************************  get book ************************************

const getBookSchema = joi.object({  
    userId : joi.string().optional().trim(),
    category :joi.string().optional().trim().min(3).max(30).regex(/^[a-zA-Z( ,\)]*$/) ,
    subcategory :joi.string().optional().trim().min(3).max(30).regex(/^[a-zA-Z( ,\)]*$/) ,
 })
        
// **********************************************  Update book ************************************
// const {title , excerpt ,ISBN , releasedAt } 

const updateSchema = joi.object({  
    title : joi.string().optional().trim().min(3).max(30).regex(/^[a-zA-Z0-9( ,\)]*$/) ,
    excerpt : joi.string().optional().trim().min(3).max(30).regex(/^[a-zA-Z0-9( ,\)]*$/) ,
    ISBN : joi.string().optional().trim().min(10).max(13).regex(/^[0-9]*$/) ,
    releasedAt : joi.string().optional().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])*$/ ) ,
 })

// **********************************************  Create Review on A book ************************************

const reviewSchema = joi.object({
    bookId : joi.string().required(),
    reviewedBy : joi.string().optional().trim().min(3).max(20).regex(/^[a-zA-Z( \)]*$/) ,
    reviewedAt : joi.string().required().trim().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])*$/ ) ,
    review : joi.string().optional().trim().min(5).max(250).regex(/^[a-zA-Z0-9( ,\)]*$/),
    rating : joi.number().required().min(1).max(5),
    isDeleted : joi.boolean().optional()
})

const updatereviewSchema = joi.object({
    reviewedBy : joi.string().optional().trim().min(3).max(20).regex(/^[a-zA-Z( \)]*$/) ,
    reviewedAt : joi.string().optional().trim().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])*$/ ) ,
    review : joi.string().optional().trim().min(5).max(250).regex(/^[a-zA-Z0-9( ,\)]*$/),
    rating : joi.number().optional().min(1).max(5),
})



module.exports = { userSchema , bookSchema , loginSchema , getBookSchema , updateSchema , reviewSchema , updatereviewSchema}