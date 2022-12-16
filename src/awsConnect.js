
import aws from "aws-sdk"
aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

export const uploadFile = function(file){
    return new Promise((resolve , reject)=>{
        
        const s3= new aws.S3({apiVersion: '2006-03-01'}); 

        const uploadParams = {
            ACL : "public-read",
            Bucket:"classroom-training-bucket",
            Key:"abc/"+file.originalname,
            Body : file.buffer
        }

        s3.upload(uploadParams , (err , data )=>{
            if(err) return reject(err.message)
            return resolve(data.Location)
        })
    })
}
