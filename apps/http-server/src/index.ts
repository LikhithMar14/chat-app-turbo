
import { HTTP_SERVER_PORT,STATUS_CODES } from "@repo/backend-common/config";
import express, { Request, Response } from "express"
import db from "@repo/db/client"

const app = express();

app.use(express.json());

app.listen(HTTP_SERVER_PORT,()=>console.log(`Server ⚙️ started at port ${HTTP_SERVER_PORT}`))

interface ResponseType{
    sucess:boolean,
    message:string,
    data?: any
}
app.post('/signup',async(req:Request,res:Response):Promise<void>=>{

    try{
        const userExists = await db.user.findFirst({
            where:{
                username:"testUsername",
            }
        })
        if(userExists){
            res.status(STATUS_CODES.ALREADY_EXISTS).json({
                message:"username already exists",
                success:false,
            })
        }
        
        const user = await db.user.create({
            data:{
                password:"testPassword" ,
                username : "testUsername",
            }
        });

        res.status(STATUS_CODES.CREATED).json({
            success:true,
            message:"User registered successfully",
            data:user.id
        })

    }catch(err){
         res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message:"Error in user registration",
            success:false,

        })
    }
})