import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config({path : "config.env"})

mongoose.set('strictQuery', false)
// mongoose.connect(process.env.MongoDB, {
//    useNewUrlParser: true
// })
mongoose.connect("mongodb+srv://bloggingSite:project123@project-01-group-3.2zpxn0w.mongodb.net/Project-02-Interns", {
   useNewUrlParser: true
})
.then(()=>{
    console.log("Mongo DB Is connected succesfully . ")
})
.catch((err)=>{ 
    console.log(err.message)
})