import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, STATUS_CODES } from "@repo/backend-common/config";
import db from "@repo/db/client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Entered auth middleware");
  console.log("JWT_SECRET in middleware: ", JWT_SECRET);

  try {
    const token: string =
      req.signedCookies.token ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(req.header("Authorization")?.replace("Bearer ", ""));

    if (!token) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Unauthorized",
        success: false,
      });
      return;
    }
    // console.log("Token: ",token);
    // console.log("JWT_SECRET: ",JWT_SECRET);
    const decodedPayload = jwt.verify(
      token,
      JWT_SECRET as string
    ) as JwtPayload;
    console.log("HERE");
    if (typeof decodedPayload !== "object") {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Unauthorized",
        success: false,
      });
      return;
    }

    const user = await db.user.findFirst({
      where: {
        id: decodedPayload.id,
      },
    });

    if (!user) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Unauthorized",
        success: false,
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Failed in auth middleware",
      success: false,
      data: err,
    });
  }
};
