// const mongoose=require('mongoose')
import {model ,Schema } from "mongoose"


const blogSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:Schema.Types.ObjectId,
        ref:'Author',
        required:true
    },
    tags:[String],
    category:{
        type:String,
        required:true
    },
    subcategory:[String],
    isPublished:{
        type:Boolean,
        default:false
    },
    publishedAt:String,
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:String
},{timestamps:true})

export const blogModel = model('Blog',blogSchema)