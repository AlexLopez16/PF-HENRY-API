import { RequestHandler } from "express";
const Student = require("../models/student");
const Company = require("../models/company");
const Admin = require("../models/admin")
import bcrypt from "bcryptjs";
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
import axios from "axios";
import querystring from "querystring";
import { jwtGenerator } from "../helper/jwt";

const authenticateWithGoogle = async (userType: string, token: string) => {
  let payload: any;
  let email;
  let user;
  const client = new OAuth2Client(process.env.CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    payload = ticket.getPayload();
    email = payload.email;
  }
  await verify();
  user = await Student.findOne({ email: email, gmail: true });
  if (!user) {
    user = await Company.findOne({ email: email, gmail: true });
  }
  if (!user) {
    user = await Admin.findOne({ email: email, gmail: true });
  }
  if (userType === "student") {
    user = await new Student({
      name: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      image: payload.picture,
      gmail: true,
      verify: true
    });
  } else if (userType === "company") {
    user = await new Company({
      name: payload.name,
      email: payload.email,
      image: payload.picture,
      gmail: true,
      verify: true
    });
  }

  else {
    throw new Error("userType is invalid.");
  }
  await user.save();

  return user;
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, from, tok, userType } = req.body;    
    let user;
    let validPassword;
    if (email && password) {
      user = await Student.findOne({ email });
      if (!user) {
        user = await Company.findOne({ email });
        if (!user) {
          user = await Admin.findOne({ email });
        }
        if (user) {
          validPassword = await bcrypt.compare(password, user.password);
        } else {
          return res
            .status(400)
            .json({ error: "The user or password is incorrect." });
        }
      } else {
        validPassword = await bcrypt.compare(password, user.password);
      }
      if (!validPassword) {
        return res
          .status(400)
          .json({ error: "The user or password is incorrect." });
      }
    } else {
      if (from && from === "gmail") {
        user = await authenticateWithGoogle(userType, tok);
      }
      if (!user) {
        return res
          .status(400)
          .json({ error: "The user or password is incorrect." });
      }
    }
    let rol = user.rol;
    let verify = user.verify;
    let id = user._id;

    let obj = { id: user._id, name: user.name }

    const token = jwtGenerator(obj);
    return res
      .status(200)
      .json({ data: "Sucessful login", token, rol, verify, id });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const github: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error("No code");
    const gitHubUser = await getGitHubUser(code);
    let user = await Student.findOne({
      username: gitHubUser.login,
      github: true,
    });
    if (!user) {
      user = await new Student({
        name: gitHubUser.name,
        username: gitHubUser.login,
        email: gitHubUser.email,
        image: gitHubUser.avatar_url,
        github: true,
        verify: true
      });
      await user.save();
    }

    let obj = { id: user._id, name: user.name }

    const token = jwtGenerator(obj);
    res.redirect(`http://localhost:5173/home?token=${token}&rol=${user.rol}&verify=${user.verify}&id=${user.id}`)
    // return res.status(200).json({
    //   data: "Sucessful login",
    //   token,
    //   rol: user.rol,
    //   verify: user.verify,
    //   id: user._id,
    // });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getGitHubUser = async (code: any) => {
  try {
    const github = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_IDG}&client_secret=${process.env.SECRET}&code=${code}`
    );
    const githubToken = github.data;
    const decode = querystring.parse(githubToken);
    const accessToken = decode.access_token;
    return axios
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    throw Error;
  }
};
