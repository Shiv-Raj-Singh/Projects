import {  blogSchema , Response , updateblog } from "../validator/valid.js";
import { blogModel } from "../models/blogModel.js";
import { isValidObjectId } from "mongoose";
import { authorModel } from "../models/authorModel.js";
import moment from "moment";

// export const createBlog = (req , res )=>{
//     try {
//         const blog = blogSchema.validateAsync(req.body)
//         blog.then((v)=>{
//             if(!isValidObjectId(v.authorId)) throw new Error("InValid Author Id")
//             return authorModel.findById(v.authorId) 
//         }).then((v)=>{
//             if(!v) throw new Error("No Author Found !")
//             if(req.body.isPublished == true) req.body.publishedAt == moment().format('YYYY-MM-DD')
//             return blogModel.create(req.body)
//         }).then((v)=>{
//             return res.status(201).send(new Response(true ,v )) 
//         })
//         .catch((err)=>{
//             if(err.isJoi==true)  return res.status(400).send(new Response(true , err.message )) 
//             if(err.message =="No Author Found !")  return res.status(404).send(new Response(true , err.message )) 
//             if(err.message =="InValid Author Id")  return res.status(400).send(new Response(true , err.message )) 
//             return res.status(400).send(new Response(false , err))
//         })
//     } catch (err) {
//         return res.status(500).send(new Response(false , err.message))
//     }
// }


export const createBlog = async (req , res )=>{
    try {
        const blog = await blogSchema.validateAsync(req.body)
        if(!isValidObjectId(blog.authorId)) return res.status(400).send(new Response(false ,"InValid Author Id" ))
        const findAuthor = await authorModel.findById(blog.authorId)
        if(!findAuthor)  return res.status(404).send(new Response(false ,"No Author Found !" ))
        if(blog.isPublished == true ) blog.publishedAt = moment().format("YYYY-MM-DD")
     
        const createblog = await blogModel.create(blog)     
        return res.status(201).send(new Response(true ,createblog )) 
        
    } catch (err) {
        if(err.isJoi==true)  return res.status(400).send(new Response(false , err.message )) 
        return res.status(500).send(new Response(false , err.message))
    }
}


// ***************************************************  Get Blogs by Query ***************************

export const getblogs = async (req , res)=>{
    try {
        const queryfilter = await updateblog.validateAsync(req.query)
        if(queryfilter.authorId){
            if(!isValidObjectId(queryfilter.authorId)) return res.status(400).send(new Response(false ,"InValid Author Id" ))
        }
        queryfilter.isPublished= true 
        queryfilter.isDeleted= false
        const blogs = await blogModel.find(queryfilter).count()
        if(blogs.length < 1) return res.status(404).send(new Response(false ,"No blogs Found !" ))
        return res.status(200).send(new Response(true , blogs )) 

    } catch (err) {
        if(err.isJoi==true)  return res.status(400).send(new Response(false , err.message )) 
        return res.status(500).send(new Response(false , err.message))
    }
}


// ***************************************************  Update Blog ***************************************

export const updateblogs =async  (req , res)=>{
    try {
        if(Object.keys(req.body).length < 1 ) return res.status(400).send(new Response(false ,"Enter Data For Update !" ))

        const blogid = req.params.blogId
        if(!blogid) return res.status(400).send(new Response(false ,"Enter blog Id" ))
        if(!isValidObjectId(blogid)) return res.status(400).send(new Response(false ,"InValid blog Id" ))

        const findBlog = await blogModel.findOne({ _id : blogid ,isDeleted : false })
        if(!findBlog)  return res.status(404).send(new Response(false ,"No Blog Found !" ))

        if(findBlog.authorId.toString() !== req.decodedToken.userId){
        return res.status(400).send(new Response(false ,"Not Authorised !" ))  }
        
        const updatedata = await updateblog.validateAsync(req.body)
        updatedata.isPublished = true
        updatedata.publishedAt = moment().format("YYYY / MM / DD")
        const data = await blogModel.findByIdAndUpdate(blogid , {$set : updatedata} , {new : true})

        return res.status(200).send(new Response(true ,data )) 

    } catch (err) {
        if(err.isJoi==true)  return res.status(400).send(new Response(false , err.message )) 
        return res.status(500).send(new Response(false , err.message))
    }
}



// ***************************************************  Delete Blog ***************************************

export const deleteBlog = (req , res)=>{
   try {
    const blogid = req.params.blogId
    if(!blogid) return res.status(400).send(new Response(false ,"Enter blog Id" ))
    if(!isValidObjectId(blogid)) return res.status(400).send(new Response(false ,"InValid blog Id" ))

    const findBlog = blogModel.findById(blogid)
    findBlog.then(v=>{
        if(!v) throw new Error("No Blog Found !")
        if(v.isDeleted == true) throw new Error("Blog Already deleted !")
        if(v.authorId.toString() !== req.decodedToken.userId)  throw new Error("Not Authorised !")  
        v.isDeleted = true
        v.save()
    }).then(()=>{
        return res.status(200).send(new Response(true , "blog Deleted succesfully !"))
    })
    .catch(err=>{
        return res.status(400).send(new Response(false , err.message))
    })
   } catch (err) {
        return res.status(500).send(new Response(false , err.message))
   }
}


// ***************************************  Delete Blogs By Query ********************************


export const deleteblogs =async  (req , res)=>{
    try {
        if(Object.keys(req.query).length < 1 ) return res.status(400).send(new Response(false ,"Enter Query For Delete blogs !" ))

        const queryfilter = await updateblog.validateAsync(req.query)
        if(queryfilter.authorId){ if(!isValidObjectId(queryfilter.authorId)) return res.status(400).send(new Response(false ,"InValid Author Id" )) }

        queryfilter.isPublished= true 
        queryfilter.isDeleted= false
        const blogs = await blogModel.find(queryfilter).lean()

        if ( blogs.length < 1){ return res.status(404).send(new Response(false ,"No blogs Found For Delete !" ))}

        const data = await blogs.filter(a=>{
            if(a.authorId.toString() == req.decodedToken.userId){
                return a  
            }
        })

    if ( data.length < 1){ return res.status(403).send(new Response(false ,"Not Authorised to Delete !" ))}

      await blogModel.updateMany({ authorId : req.decodedToken.userId }, {$set : {isDeleted : true , deletedAt : moment().format("YYYY / MM / DD")} })
            
      return res.status(200).send(new Response(true , "blog Deleted succesfully !"))
     
    } catch (err) {
        if(err.isJoi==true)  return res.status(400).send(new Response(false , err.message )) 
        return res.status(500).send(new Response(false , err.message))
    }
}