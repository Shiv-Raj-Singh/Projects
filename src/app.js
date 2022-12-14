import express from "express"
import "./dbConnect.js"
import { router } from "./routes/route.js"

const app = express()
app.use(express.json())
const port =  3000 || process.env.PORT

app.use(express.Router().all('/*' , (req , res)=>{
    return res.status(400).send({status:false, msg:"invalid http request !"})
}))

app.use('/' , router)
app.listen(port , ()=>{
    console.log(`App is Running on Port NUmber ${port}`)
})
