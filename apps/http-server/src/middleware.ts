import { NextFunction, Request , Response} from "express";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import db from "@repo/db/client";


export const authMiddleware = (req:Request,_:Response,next:NextFunction)=>{
    
}