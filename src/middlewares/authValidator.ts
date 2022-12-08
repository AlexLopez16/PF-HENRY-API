import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();

import { searchUser } from "../helper/searchuser";

declare global {
  namespace Express {
    interface Request {
      user: any; //or can be anythin
    }
  }
}

const pathsWithoutAuth = new Map<string, Set<string>>();
pathsWithoutAuth.set("/api/auth", new Set(["POST", "GET"]));
pathsWithoutAuth.set("/api/student", new Set(["POST"]));
pathsWithoutAuth.set("/api/company", new Set(["POST"]));

export const verifyToken: RequestHandler = async (req, res, next) => {
  let requestUri: string = req.originalUrl;
  const baseUrl =
    requestUri.indexOf("?") === -1
      ? requestUri
      : requestUri.slice(0, requestUri.indexOf("?"));
  if (pathsWithoutAuth.get(baseUrl)?.has(req.method)) {
    next();
    return;
  }
  const token = req.header("user-token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const { id } = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await searchUser(id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Access denied" });
  }
};
