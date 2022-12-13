import moment from 'moment'
import jwt  from 'jsonwebtoken'

export const authentication = function(req,res,next){
    try{ 
    const token=req.headers['x-api-key']
    if(!token) return res.status(400).send({status:false,msg:"Token is missing from Headers !"})
    if (token) {
        jwt.verify(token, "Shiv Raj Singh", (error, decode) => {
            if (error) {
                if (error.message == 'jwt expired') {
                    return res.status(400).send({ status: false, message: 'Your Token has been expired login Again' })
                }else{
                    return res.status(401).send({ status: false, message: "Authenitication failed" })
                } 
            }
            req.decodedToken = decode  
            next()
        })  
    }   
}
catch(err){
    return res.status(500).send({status:false, Error:err.message})
}
}

