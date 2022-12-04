import { RequestHandler } from "express";
const User = require("../models/alumno");
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
require("dotenv").config();

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "email no found" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).json({ error: "invalid password" });

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.TOKEN_SECRET as string
    );

    res.json({ data: "sucessful login", token: { token } });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
