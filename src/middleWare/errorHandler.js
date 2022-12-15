const globalErrorHandler = (err , req ,res , next )=>{
    err.message = err.message || "Internal Server Error !"
    err.statusCode = err.statusCode || 500 

    if(err.isJoi == true){
        err.message = err.message
        err.statusCode = 400
        const [details] = err.details
        if(details.type =='string.pattern.base'){
            err.message = `Please enter A Valid ${details.path} !`
        }
    }

    if(err.code == 11000){
        err.statusCode = 400
        const values = Object.keys(err.keyValue)
        for (i of values){
            err.message = `Duplicate Key Error For ${i} !`
        }
    }
    res.status(err.statusCode).json({
        status : false ,
        message : err.message
    })
}

module.exports = {globalErrorHandler}