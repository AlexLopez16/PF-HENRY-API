import { RequestHandler, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { searchUser } from "../helpers/searchUser";
import { formatError } from "../utils/formatErros";
import { verifyJwt } from '../helpers/verifyJwt'
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
  if (!token) return res.status(401).json(formatError("Acceso denegado"));
  try {
    const { id } = verifyJwt(token)

    const user = await searchUser(id);
    console.log(user);
    if (!user.state) return res.redirect(303, "http://localhost:5173/login");

    req.user = user;
    if (!user.verify) throw new Error("Confirma tu email");
    next();
  } catch (error: any) {
    return res.status(401).json(formatError(error.message));
  }
};
