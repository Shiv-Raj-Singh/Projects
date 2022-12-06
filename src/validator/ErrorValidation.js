const  { isValidName, isValidTitle,isValidPhone, 
    isValidEmail, isValidPass, isValidObjectIds,
    isBoolean, isValid ,isValidBookTitle , checkDate} =  require('./valid')


const ErrorHandler = function(status, message){
    this.status = status
    this.message = message 
}

module.exports = {ErrorHandler}

