import jwt from "jsonwebtoken";
require("dotenv").config();

export const jwtGenerator = (obj:any) => {
  return jwt.sign(
    obj,
    process.env.TOKEN_SECRET as string,
    { expiresIn: "24h" }
  );
};
