import { RequestHandler, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { searchUser } from "../helper/searchUser";
import { formatError } from "../utils/formatErros";
import {verifyJwt} from '../helper/verifyJwt'
require("dotenv").config();

// Este declare nos permite crear nuestras porpias requests.

declare global {
  namespace Express {
    interface Request {
      user: any; //or can be anythin
    }
  }
}


export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = req.header("user-token");
  if (!token) return res.status(401).json(formatError("Access denied"));
  try {
    const {id}=verifyJwt(token)
    
    const user = await searchUser(id);
   
    req.user = user;
    if (!user.verify) throw new Error("Confirm your email");
    next();
  } catch (error: any) {
    return res.status(401).json(formatError(error.message));
  }
};
