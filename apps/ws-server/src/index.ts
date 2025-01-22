import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  JWT_SECRET,
  WEB_SOCKET_SERVER_PORT,
} from "@repo/backend-common/config";
import db from "@repo/db/client";
const wss = new WebSocketServer({ port: Number(WEB_SOCKET_SERVER_PORT) });

interface User {
  ws: WebSocket;
  rooms: Set<string>;
  userId: string;
}

const users: Map<WebSocket, User> = new Map();

const verifyUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded: ", decoded);
    if (typeof decoded !== "object" || !decoded.user) {
      return null;
    }
    return decoded.user as string;
  } catch (err) {
    console.log("Error in verifying token", err);
    return null;
  }
};
wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    console.log("No url");
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  console.log(token);
  const userId = verifyUser(token as string);

  if (!userId) {
    console.log("Invalid user");
    ws.close();
    return;
  }
  const user: User = { ws, rooms: new Set(), userId };
  users.set(ws, user);

    ws.on("message", async (message) => {
    let parsedData;
    try {
      parsedData = JSON.parse(message.toString());
    } catch (err) {
      console.error("Error in parsing message", err);
      return;
    }
    const { type, roomId, message: chatMessage } = parsedData;
    switch (type) {
      case "join_room": {
        if (roomId) {
          user.rooms.add(roomId);
          console.log(`User ${userId} joined room ${roomId}`);
        }
        break;
      }

      case "leave_room": {
        if (roomId) {
          user.rooms.delete(roomId);
          console.log(`User ${userId} left room ${roomId}`);
        }
        break;
      }
      case "chat": {
        console.log(roomId, chatMessage);
        if (roomId && chatMessage && userId) {
          
          await db.chat.create({
            data: { roomId: Number(roomId), message: chatMessage, userId },
          });

          for (const [, connectedUser] of users) {
            console.log("Connected User:", connectedUser);
            console.log("Room ID:", roomId);
            console.log("Rooms Set:", connectedUser.rooms);

            if (connectedUser.rooms.has(roomId)) {
              console.log("I am here");
              connectedUser.ws.send(
                JSON.stringify({
                  type: "chat",
                  message: chatMessage,
                  roomId,
                })
              );
            }
          }
        }
        break;
      }

      default:
        console.warn("Unknown message type:", type);
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected`);
    users.delete(ws);
  });
});
