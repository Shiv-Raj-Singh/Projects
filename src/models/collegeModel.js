
import {model , Schema } from "mongoose"
const collegeSchema = new Schema({
    name: {
        type: String,
        required: [true , "Please enter A College Name !"],
        Unique:  true,
        lowercase : true,
        trim : true ,
        match : [/^[a-zA-Z( \)]{3,30}$/ , "College Name Should be A string Min 3 Length !"],
        
    },
    fullName: {
        type: String,
        required: [true , "Please enter A College Full-Name !"],
        trim : true ,
        match : [/^[a-zA-Z( \)]{3,30}$/ , "Full Name Should be A string Min 3 Length And Max 30 !"],
        Unique: true
    },
    logoLink: {
        type: String,
        required: [true , "Please enter A College Logolink !"],
        Unique:true
    },
    isDeleted: {
        type: Boolean ,
        default: false
    }
},
    { timestamps: true })

const collegeModel = model('College-Model', collegeSchema)
export default collegeModel