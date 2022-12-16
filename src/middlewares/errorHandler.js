
export const globalerrorHandler = (err , req , res , next )=>{
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    if(err.name == "ValidationError"){
        err.message = err.message
        err.statusCode  = 400
        const keys = err.errors
        const error = Object.values(keys)
        if(error.length > 0 ){
            err.message = error[0].message
        }
    }

    if(err.code == "11000"){
        err.statusCode = 400
        const values = Object.keys(err.keyValue)
        console.log(values)
        for (let i of values){
            err.message = `Duplicate Key Error For ${i} !`
        }
    }
 
   res.status(err.statusCode).json({
    status : false ,
    message : err.message,
   })
}



