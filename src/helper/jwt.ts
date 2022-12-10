import jwt from "jsonwebtoken";
require("dotenv").config();

export const jwtGenerator = (userId: any, userName: any) => {
  return jwt.sign(
    {
      name: userName,
      id: userId,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "2h" }
  );
};
