
class ErrorHandler extends Error{
    constructor(message , statusCode){
        super(message)
        this.status = false
        this.message = message 
        this.statusCode = statusCode
    }
}

module.exports = {ErrorHandler}





