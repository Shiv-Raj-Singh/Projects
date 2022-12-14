export class ErrorHandler extends Error {
    constructor(message ,statusCode ){
        super(message)
        this.statusCode = statusCode
        this.status = false 
        this.message = message
    }
}

export class SuccessResonse {
    constructor(data){
        // this.success = successFul
        this.status = true
        this.data = data
    }
}