import dotenv from "dotenv"
import { resolve } from "path";
dotenv.config({ path: resolve(__dirname, ".env") });//es-build issue so gave absolute path


import { CookieOptions } from 'express';

console.log(dotenv.config({ path: resolve(__dirname, ".env") }));


 const cookieOptions: CookieOptions = {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
};


const JWT_SECRET = process.env.JWT_SECRET || "123434";
const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT || 3001;
const WEB_SOCKET_SERVER_PORT = process.env.WEB_SOCKET_SERVER_PORT || 8080;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

console.log(process.env.JWT_SECRET)
console.log(process.env.HTTP_SERVER_PORT)
console.log(process.env.WEB_SOCKET_SERVER_PORT)
console.log(process.env.COOKIE_SECRET)

 const STATUS_CODES = {
    CONTINUE: 100,
    SWITCHING_PROTOCOL: 101,
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    REDIRECTED: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ALREADY_EXISTS:409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} ;


export { JWT_SECRET, HTTP_SERVER_PORT, WEB_SOCKET_SERVER_PORT,STATUS_CODES,cookieOptions,COOKIE_SECRET};


