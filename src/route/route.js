const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const middleware = require('../middleWare/auth')

router.post("/register",middleware.userCreateValidation , userController.createUser)

router.post("/login", userController.userLogin)

router.post("/books",middleware.bookCreateValidation,middleware.authentication ,  bookController.createBook)

// router.get("/books",middleware.authentication, bookController.getBook)

// router.get("/books/:bookId", bookController.getBookById)

// router.put("/books/:bookId", bookController.updateBook)

// router.delete("/books/:bookId", bookController.deleteBook)

// router.post("/books/:bookId/review", reviewController.createReview )

// router.put("/books/:bookId/review/:reviewId", reviewController.updateReview )

// router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview )

module.exports = router

