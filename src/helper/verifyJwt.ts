import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();

export const verifyJwt=(token:any)=>{
    
    return jwt.verify(
    token,
    process.env.TOKEN_SECRET as string
  ) as JwtPayload
}