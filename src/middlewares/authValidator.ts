import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.header("user-token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Access denied" });
  }
};
