import {Router} from 'express'
import { createAuthor, loginAuthor } from '../controller/authorController.js'
import { createBlog, deleteBlog, getblogs , updateblogs  , deleteblogs} from '../controller/blogController.js'
import { authentication } from '../middleware/middware.js'



export const router = Router()

router.get('/test-me' , (req,res)=>{
    res.send('yukta ki first api')
})
router.post('/author-create' , createAuthor)
router.post('/login' , loginAuthor)
router.post("/blog-create", authentication , createBlog)
router.get("/get-blogs", authentication , getblogs)
router.put("/update-blog/:blogId", authentication , updateblogs)
router.delete("/delete-blog/:blogId", authentication , deleteBlog)
router.delete("/delete-blogs", authentication , deleteblogs)
