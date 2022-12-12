// import { authorSchema ,Response } from "../validator/valid.js"


// export const authorValidate = (req , res ,next)=>{
//     try {
//         const data = authorSchema.validateAsync(req.body)
//             data.then(()=>{
//                 next()
//             })
//             .catch(err =>{
//                 if(err.isJoi==true){
//                   return res.status(400).json(new Response(false , err.message))
//                 }
//             })
//     } catch (error) {
//         res.status(500).json(new Response(false , err.message))
//     }   
// }