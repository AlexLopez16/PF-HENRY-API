import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const pathsWithoutAuth: Set<string> = new Set(["/api/auth","/api/students","api/company"]);

export const verifyToken: RequestHandler = (req, res, next) => {
  let requestUri: string = req.originalUrl;
  const baseUrl = requestUri.indexOf('?') === -1 ? requestUri : requestUri.slice(0, requestUri.indexOf('?'));
  if (pathsWithoutAuth.has(baseUrl)) {
    next();
    return;
  }
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
