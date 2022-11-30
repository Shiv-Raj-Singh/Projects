
const express = require('express')
const mongoose = require('mongoose')
const routes = require('./route/route')
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://bloggingSite:project123@project-01-group-3.2zpxn0w.mongodb.net/Project-03-Books-Management-Systems",{
    useNewUrlParser:true
}).then(()=> console.log('MongoDB is Connected For Project-> 3 Books Management Systems'))
.catch((arr)=>console.log(arr.message))

// mongoose.connect("mongodb+srv://amanprajapat82780:Lucky82780@newproject.3qdy8y3.mongodb.net/group17Database?retryWrites=true&w=majority",{
//     useNewUrlParser:true
// }).then(()=>console.log("Mongoose Connected"))
// .catch((err)=>console.log(err))

app.use('/', routes)

app.listen(3000 || process.env.PORT , ()=>{
    console.log('Server is Running On Port Number :'+3000 || process.env.PORT)
})