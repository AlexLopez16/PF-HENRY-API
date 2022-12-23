import { hash } from "../helpers/hash";
import { RequestHandler } from "express";
 import { recuperatePassword } from "../helpers/sendConfirmationEmail";
import { verifyJwt } from "../helpers/verifyJwt";

import { formatError } from "../utils/formatErros";
import { jwtGenerator } from "../helpers/jwt";
const Student = require("../models/student");
const Company = require("../models/company");

require("dotenv").config();

export const password: RequestHandler = async (req, res) => {
  try {
    const { email } = req.query;
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

export const redirectPassword:RequestHandler = async (req, res)=>{
 try{ 
  console.log('hola')
  const {token} = req.params
  console.log(token)
  const { email } = verifyJwt(token);
  let user = await Student.findOne({ email: email });
  if (!user) {
    user = await Company.findOne({ email: email });
  }
  if (!user) throw new Error("Email invalid");
  let obj={id:user._id,email:user.email}
  const tok= jwtGenerator(obj);
  res.redirect(`http://localhost:5173/recoverPassword?token=${tok}&rol=${user.rol}&verify=${user.verify}&id=${user.id}`)
}catch(error:any){
  console.log(error.message)
}

}

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

};
