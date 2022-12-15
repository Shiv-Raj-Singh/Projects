
const express = require('express')
const mongoose = require('mongoose')
const routes = require('./route/route')
const app = express()
// require("dotenv").config({path : ".env"})
const multer = require('multer')
const { globalErrorHandler } = require('./middleWare/errorHandler')

app.use(express.json())
app.use(multer().any())
const port = process.env.PORT || 3000

mongoose.connect("mongodb+srv://bloggingSite:project123@project-01-group-3.2zpxn0w.mongodb.net/Project-03-Books-Management-Systems",{
    useNewUrlParser:true
}).then(()=> console.log('MongoDB is Connected For Project-> 3 Books Management Systems'))
.catch((arr)=>console.log(arr.message))

app.use('/', routes)

app.use(globalErrorHandler)

app.listen(port , ()=>{
    console.log('Server is Running On Port Number :'+ port)
})