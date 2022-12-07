import { RequestHandler } from "express";
const Student = require("../models/student");
const Company = require("../models/company");
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
import axios from "axios";
import querystring from "querystring";

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, from, tok } = req.body;

    let user;
    let validPassword;
    if (email && password) {
      user = await Student.findOne({ email });
      if (!user) {
        user = await Company.findOne({ email });
        console.log(user);
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
      let emai;
      if (from && from === "gmail") {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        async function verify() {
          const ticket = await client.verifyIdToken({
            idToken: tok,
            audience: process.env.CLIENT_ID,
          });
          const payload = ticket.getPayload();
          emai = payload.email;
        }
        await verify();
      }

      user = await Student.findOne({ email: emai });
      console.log(emai);
      if (!user)
        return res
          .status(400)
          .json({ error: "The user or password is incorrect." });
    }

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "2h" }
    );
    return res.json({ data: "Sucessful login", token });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const github: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("code", code)
    if (!code) throw new Error("No code");
    const gitHubUser = await getGitHubUser(code);
    console.log("gitHubUser", gitHubUser)
    const token = jwt.sign({id:gitHubUser.id}, process.env.TOKEN_SECRET as string, {
      expiresIn: "500s"
    });
    console.log("token", token)
    return res.json({ data: "Sucessful login", token });
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
    console.log("githubToken", githubToken)
    console.log("decode", decode)
    const accessToken = decode.access_token;
    return axios
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Error getting user from GitHub`);
        throw error;
      });
  } catch (error) {
    throw Error;
  }
};
