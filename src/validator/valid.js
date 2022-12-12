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
export const blogSchema = Joi.object({
    title:Joi.string().required().trim().alphanum().min(3).max(25),
    body:Joi.string().required().trim().regex(/^[a-zA-Z0-9, ]$/).min(10).max(250),
    authorId:Joi.string().trim().required().regex(/^[a-fA-F0-9]{24}$/),
    // tags: Joi.array().items(Joi.string()).required().trim(),
    tags: Joi.array().items(Joi.string()).required() ,
    category : Joi.string().trim().required(),
    subcategory : Joi.string().trim().required() ,
    isPublished : Joi.boolean().optional(),
    isDeleted : Joi.boolean().optional(),
    // publishedAt : Joi.string().optional().trim().Date().format("YYYY-MM-DD"),
    // deletedAt : Joi.string().optional().trim().isoDate().format("YYYY-MM-DD"),
})


