const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const middleware = require('../middleWare/auth')
const { ErrorHandler } = require("../validator/ErrorValidation")

router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)

router.post("/books",middleware.authentication , bookController.createBook)
router.get("/books",middleware.authentication , bookController.getBook)
router.get("/book/:bookId",middleware.authentication , bookController.getBookById)
router.put("/book/:bookId",middleware.authentication , middleware.autherisation , bookController.updateBook)
router.delete("/book/:bookId",middleware.authentication , middleware.autherisation , bookController.deleteBook)

router.post("/books/:bookId/review",reviewController.createReview )
router.put("/books/:bookId/review/:reviewId",middleware.putDeeleteReview , reviewController.updateReview ) 
router.delete("/books/:bookId/review/:reviewId",middleware.putDeeleteReview , reviewController.deleteReview )

router.all('/*' , (req,res , next)=>{
    return next(new ErrorHandler(`this Url -> ${req.url} not Found on Server !` , 404))
})
 
module.exports = router

