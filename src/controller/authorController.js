import { authorSchema ,Response ,loginSchema} from "../validator/valid.js"
import {authorModel} from "../models/authorModel.js"
import jwt from "jsonwebtoken"

export const createAuthor = (req , res )=>{
   try{
    authorSchema.validateAsync(req.body)
    .then(v=>{
        return authorModel.findOne({email:req.body.email})
    }).then(v=>{
        if(v){  throw new Error("Email Already Exist !")  }
    }).then(()=>{
       return authorSchema.validateAsync(req.body)
    }).then((v)=>{
       return authorModel.create(v)
    }).then(v=>{
    return res.status(201).send(new Response(true ,v )) 
    }).catch((err)=>{
        if(err.isJoi==true){
            return res.status(400).json(new Response(false , err.message))
          }
    res.status(400).json(new Response(false , err.message))
    })
} catch (err) {
    res.status(500).json(new Response(false , err.message))
   }
}

// **************************************************************  Login  *****************************************

export const loginAuthor = (req , res )=>{
    try {
        loginSchema.validateAsync(req.body)
        .then(v=>{
            return authorModel.findOne({email:req.body.email})
        }).then(v=>{
            if(!v) throw new Error("Email Not Found !")
            else if(v.password !== req.body.password){
                throw new Error("Invalid Password !")
            }
          return v._id
        }).then(v=>{
            const payload = {userId :v , projectName: "Blogging-Sites" }
           return jwt.sign(payload , "Shiv Raj Singh" ,{expiresIn:"24h"})
        }).then(token =>{
            res.setHeader("x-api-key", token)
            return res.status(201).send(new Response(true  , {token : token} )) 
        }).catch((err)=>{
            if(err.isJoi==true){
                return res.status(400).json(new Response(false , err.message))
              }
        res.status(400).json(new Response(false , err.message))
        })

} catch (err) {
        res.status(500).json(new Response(false , err.message))
    }
}
