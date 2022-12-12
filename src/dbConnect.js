import mongoose from "mongoose"

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://bloggingSite:project123@project-01-group-3.2zpxn0w.mongodb.net/Project-01-bloggingSite" , {
    useNewUrlParser : true
})

.then(()=>console.log('Mongo-DB Connected Succesfully'))
.catch(err=> console.log(err.message))