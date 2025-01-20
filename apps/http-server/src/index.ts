
import { HTTP_SERVER_PORT,JWT_SECRET,STATUS_CODES,cookieOptions,COOKIE_SECRET} from "@repo/backend-common/config";
import express, { Request, Response } from "express"
import db from "@repo/db/client"
import { CreateUserSchema,SigninSchema} from "@repo/common/types"
import  bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
const app = express();

app.use(express.json());
console.log(COOKIE_SECRET)
app.use(cookieParser(COOKIE_SECRET))

app.listen(HTTP_SERVER_PORT,()=>console.log(`Server ⚙️  started at port ${HTTP_SERVER_PORT}`))

interface ResponseType{
    sucess:boolean,
    message:string,
    data?: any
}
app.post('/signup',async(req:Request,res:Response):Promise<void>=>{

    const validatedData  = CreateUserSchema.safeParse(req.body)

    if(!validatedData.success){
        console.log(validatedData.error);
        res.status(STATUS_CODES.BAD_REQUEST).json({
            success:false,
            message:"Invalid user data",
            data:validatedData.error.errors
        })
        return
    }



    try{
        const {username,password} = validatedData.data
        const userExists = await db.user.findFirst({
            where:{
                username
            }
        })
        if(userExists){
            res.status(STATUS_CODES.ALREADY_EXISTS).json({
                message:"username already exists",
                success:false,
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await db.user.create({
            data:{
                password:hashedPassword,
                username
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

app.post('/login',async(req:Request,res:Response):Promise<void> => {
    const validatedData = SigninSchema.safeParse(req.body);
    if(!validatedData.success){
        console.log(validatedData.error.errors);
        res.status(STATUS_CODES.BAD_REQUEST).json({
            success:false,
            message:"Invalid user data",
            data:validatedData.error.errors
        })
        return;
    }

    try{
        const { username, password} = validatedData.data
        const userExists = await db.user.findFirst({
            where:{username}
        })
        if(!userExists){
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message:"not authorized",
                success:false,
            })
            return;
        }
        
        const originalPassword = userExists.password;
        const recievedPassword = password;

        const isPasswordCorrect = await bcrypt.compare(recievedPassword, originalPassword);


        if(!isPasswordCorrect){
            res.status(STATUS_CODES.BAD_REQUEST).json({
                message:"not authorized",
                success:false,
            })
            return;
        }
        const token = jwt.sign({
            user:userExists.id,
            username:userExists.username
        }, JWT_SECRET)

        res.cookie("token",token,cookieOptions);
         res.status(STATUS_CODES.OK).json({
            message:"Logged in Successfully",
            success:true,
            token
        })
        return;

    }catch(err){
        console.log(err)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message:"Login operation failed",
            success:false,
            data:err
        })

        return;
    }
})