import {Router} from 'express'
import { createAuthor, loginAuthor } from '../controller/authorController.js'
// import { authorValidate } from '../middleware/middware.js'

export const router = Router()

router.get('/test-me' , (req,res)=>{
    res.send('yukta ki first api')
})
router.post('/test-me' , createAuthor)
router.post('/login' , loginAuthor)
