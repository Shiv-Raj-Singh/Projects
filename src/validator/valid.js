export class Response{
    constructor(status , data){
        this.status = status 
        this.data = data
    }
}

import Joi from "joi"


export const authorSchema = Joi.object({
    fname:Joi.string().required().trim().regex(/^[a-zA-Z]*$/).min(3).max(15),
    lname:Joi.string().required().trim().regex(/^[a-zA-Z]*$/).min(3).max(15),
    title:Joi.string().trim().valid("Mr" , "Mrs" , "Miss").required(),
    email: Joi.string().required().trim().email(),
    password : Joi.string().min(8).max(15).regex(/^[a-zA-Z0-9]*$/).required()
})

export const loginSchema = Joi.object({
    email: Joi.string().required().trim().email(),
    password : Joi.string().min(8).max(15).regex(/^[a-zA-Z0-9]*$/).required()
})

// ********************************************** blog Model ***************************************** 

export const blogSchema = Joi.object({
    title:Joi.string().required().trim().alphanum().min(3).max(35),
    body:Joi.string().required().trim().regex(/^[a-zA-Z0-9( ,\)]*$/).min(10).max(250),
    authorId:Joi.string().trim().required(),
    tags: Joi.array().items(Joi.string().trim().min(3).regex(/^[a-zA-Z0-9( ,\)]*$/)).required() ,
    category : Joi.string().trim().required(),
    subcategory : Joi.array().items(Joi.string().regex(/^[a-zA-Z0-9, ]*$/)).required(),
    isPublished : Joi.boolean().optional(),
    isDeleted : Joi.boolean().optional(),
    publishedAt : Joi.string().optional() , 
})

//  ************************************ get blogs by querys ********************************************************
// { category, subcategory, tags, authorId } 


// *********************************** Update Blogs   *****************************************  

export const updateblog = Joi.object({
    authorId:Joi.string().trim().optional(),
    title:Joi.string().optional().trim().alphanum().min(3).max(50),
    body:Joi.string().trim().regex(/^[a-zA-Z0-9( ,\)]*$/).min(10).max(250).optional(),
    tags: Joi.string().optional(),
    category : Joi.string().trim().optional(),
    subcategory : Joi.string().trim().optional(),
    isPublished : Joi.boolean().optional(),
})

