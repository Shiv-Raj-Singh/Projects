
import {model , Schema } from "mongoose"
const collegeSchema = new Schema({
    name: {
        type: String,
        required: [true , "Please enter A College Name !"],
        Unique:  [true , `Name Already Exist !`],
        lowercase : true,
        trim : true ,
        match : [/^[a-zA-Z]{3,30}$/ , "College Name Should be A string Min 3 Length !"],
        
    },
    fullName: {
        type: String,
        required: [true , "Please enter A College Full-Name !"],
        trim : true ,
        match : [/^[a-zA-Z( \)]{5,20}$/ , " Name Should be A string Min 3 Length !"],
        Unique: [true , `fullName is Already Exist !`]
    },
    logoLink: {
        type: String,
        required: [true , "Please enter A College Logolink !"],
    },
    isDeleted: {
        type: [Boolean , "Please enter A Boolean Value !"],
        default: false
    }
},
    { timestamps: true })

const collegeModel = model('College-Model', collegeSchema)
export default collegeModel