// import {express} from ("express" )

const express = require('express')
const mongoose = require('mongoose')
const routes = require('./route/route')
const app = express()

mongoose.connect("mongodb+srv://bloggingSite:project123@project-01-group-3.2zpxn0w.mongodb.net/Project-03-Books-Management-Systems",{
    useNewUrlParser:true
}).then(()=> console.log('MongoDB is Connected For Project-> 3 Books Management Systems'))
.catch((arr)=>console.log(arr.message))

app.use('/', routes)

app.listen(3000 || process.env.PORT , ()=>{
    console.log('Server is Running On Port Number :'+3000 || process.env.PORT)
})