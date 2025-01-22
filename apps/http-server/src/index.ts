import {
  HTTP_SERVER_PORT,
  JWT_SECRET,
  STATUS_CODES,
  cookieOptions,
  COOKIE_SECRET,
} from "@repo/backend-common/config";
import express, { Request, Response } from "express";
import db from "@repo/db/client";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware";
const app = express();

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.listen(HTTP_SERVER_PORT, () =>
  console.log(`Server ⚙️ started at port ${HTTP_SERVER_PORT}`)
);

interface ResponseType {
  sucess: boolean;
  message: string;
  data?: any;
}
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const validatedData = CreateUserSchema.safeParse(req.body);

  if (!validatedData.success) {
    console.log(validatedData.error);
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid user data",
      data: validatedData.error.errors,
    });
    return;
  }

  try {
    const { username, password } = validatedData.data;
    const userExists = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (userExists) {
      res.status(STATUS_CODES.ALREADY_EXISTS).json({
        message: "username already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        password: hashedPassword,
        username,
      },
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user.id,
    });
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Error in user registration",
      success: false,
    });
  }
});

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const validatedData = SigninSchema.safeParse(req.body);
  if (!validatedData.success) {
    console.log(validatedData.error.errors);
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid user data",
      data: validatedData.error.errors,
    });
    return;
  }

  try {
    const { username, password } = validatedData.data;
    const userExists = await db.user.findFirst({
      where: { username },
    });
    if (!userExists) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "not authorized",
        success: false,
      });
      return;
    }

    const originalPassword = userExists.password;
    const recievedPassword = password;

    const isPasswordCorrect = await bcrypt.compare(
      recievedPassword,
      originalPassword
    );

    if (!isPasswordCorrect) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "not authorized",
        success: false,
      });
      return;
    }
    const token = jwt.sign(
      {
        user: userExists.id,
        username: userExists.username,
      },
      JWT_SECRET
    );

    res.cookie("token", token, cookieOptions);
    res.status(STATUS_CODES.OK).json({
      message: "Logged in Successfully",
      success: true,
      token,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Login operation failed",
      success: false,
      data: err,
    });

    return;
  }
});

app.post(
  "/room",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid room data",
        success: false,
      });
      return;
    }
    console.log("Hello");
    console.log("USER ID: ", req.user);
    console.log("I am in room creation");
    console.log("JWT_SECRET in http route: ", JWT_SECRET);

    const userId = req.user.id as string;
    const slug = parsedData.data.name;

    try {
      const room = await db.room.create({
        data: {
          slug,
        },
      });

      res.status(STATUS_CODES.CREATED).json({
        message: "Room created successfully",
        success: true,
        data: room,
      });

      return;
    } catch (err) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Room already exists with this name",
        success: false,
        data: err,
      });
    }
  }
);

app.get("/room/:slug",authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;
  console.log("Recieved slug: ", slug);

  try {
    const room = await db.room.findFirst({
      where: { slug },
    });
    if (!room) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Room does not exits",
        sucess: false,
      });
      return;
    }
    res.status(STATUS_CODES.OK).json({
      message: "Room fetched successfully",
      success: true,
      data: room,
    });
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Error in fetching room",
      success: false,
      data: err,
    });
  }
});

app.get("/chat/:roomSlug",authMiddleware,async(req:Request,res:Response):Promise<void> => {
    let roomSlug = req.params.roomSlug;
    console.log(roomSlug);
    
    try{
       
        if(typeof roomSlug !== "string"){
          res.status(STATUS_CODES.BAD_REQUEST).json({
            message:"Invalid room slug",
            success:false,
          })
          return;
        }
        const roomId = await db.room.findFirst({
          where:{
            slug:roomSlug
          },
          select:{
            id:true
          }
        });


        if(!roomId){
          res.status(STATUS_CODES.NOT_FOUND).json({
            message:"Room not found",
            success:false,
          });
          return;
        }
        console.log("Hello")

        const messages = await db.chat.findMany({
            where:{
                roomId:roomId.id
            },
            orderBy:{
                createdAt:"desc"
            },
            take:50
        });
    
        res.status(STATUS_CODES.OK).json({
            message:"Messages fetched successfully",
            success:true,
            data:messages
        });

    }catch(err){
        console.log(err);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message:"Error in fetching messages",
            success:false,
            data:err
        })
    }
})