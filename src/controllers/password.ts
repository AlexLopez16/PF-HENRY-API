import { hash } from "../helper/hash";
import { RequestHandler } from "express";
import { recuperatePassword } from "../helper/sendConfirmationEmail";
import { verifyJwt } from "../helper/verifyJwt";

import { formatError } from "../utils/formatErros";
const Student = require("../models/student");
const Company = require("../models/company");

require("dotenv").config();

export const password: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Student.findOne({ email: email });
    if (!user) {
      user = await Company.findOne({ email: email });
    }
    if (!user) throw new Error("Email invalid");

    recuperatePassword(user);

    res.status(200).json({
      msg: "Email send",
    });
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }
};

export const modifyPassword: RequestHandler = async (req, res) => {
  try {
    const token = req.header("user-token");

    const { password } = req.body;

    const { email } = verifyJwt(token);

    let hashPassword = await hash(password);

    let user = await Student.findOne({ email: email });
    if (!user) {
      user = await Company.findOne({ email: email });
    }
    if (!user) throw new Error("Email invalid");

    const { rol, _id: id } = user;
    let modify;
    if (rol === "STUDENT_ROL") {
      modify = await Student.findByIdAndUpdate(
        id,
        { password: hashPassword },
        {
          new: true,
        }
      );
    } else {
      modify = await Company.findByIdAndUpdate(
        id,
        { password: hashPassword },
        {
          new: true,
        }
      );
    }

    res.status(200).json({
      msg: "password modify",
    });
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }

  ("$2a$10$MH.dIr9QBAQBWh3AoQNWwecUV6SRf3IH5zcqeaUUPJXwFD27sp88.");
};
