import mongoose from "mongoose";
const objectId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , "Name Should be Required !"] ,
      match : [/^[a-zA-Z( \)]*$/ , " Name Should be A Alphabate Min 3 or Max 25 !"]
    },
    email: {
      type: String,
      match : [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,5})*$/  , "Email Should be Valid !"] ,
      required: [true , "email Should be Required !"] ,
      unique: true,
    },
    mobile: {
      type: String,
      required: [true , "mobile Number Should be Required !"] ,
      match : [/^[6-9][0-9]{9}$/  , "Mobile Number Should be Valid !"] ,
      unique: true,
    },
    collegeId: {
      type: objectId,
      ref: "College-Model",
    },
    isDeleted: {
        type: [Boolean , "Please enter A Boolean Value !"],
      default: false,
    },
  },
  { timestamps: true });

const internModel  = new mongoose.model("intern-Model", internSchema);
export default internModel