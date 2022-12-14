
export const globalerrorHandler = (err , req , res , next )=>{
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    if(err.name == "ValidationError"){
        err.message = err.message
        err.statusCode = 400
    }
    if(err.code == "11000"){
        if(err.keyValue.email){
            err.statusCode = 400
            err.message = ` email ${err.keyValue.email}  Already Exist !`
        }
        if(err.keyValue.mobile){
            err.statusCode = 400
            err.message = `Mobile Number ${err.keyValue.mobile}  Already Exist !`
        }

        err.statusCode = 400
        err.message = `${err.keyValue} Already Exist !`
    }
 
   res.status(err.statusCode).json({
    status : false ,
    message : err.message,
   })
}



