const { default: mongoose } = require("mongoose");
const reviewSchema = new mongoose.Schema(
    {
        bookId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Book",
            required : true,
            trim:true
        },
        reviewedBy:{
            type :String,
            required:true,
            default:"Guest",
            trim:true
        },
        reviewedAt:{
            type:Date,
            reuired:true,
            trim:true
        },
        rating:{
            type:Number,
            required:true,
            trim:true
        },
        review:{
            type:String,
            trim:true
        },
        isDeleted:{
            type:Boolean,
            default : false
        }
        
    }
)
module.exports = mongoose.model("Review", reviewSchema)