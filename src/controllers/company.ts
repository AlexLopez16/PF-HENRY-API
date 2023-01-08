import { RequestHandler } from "express";
const User = require("../models/company");
import { hash } from "../helpers/hash";
import { jwtGenerator } from "../helpers/jwt";
import { formatError } from "../utils/formatErros";
import {
  sendConfirmationEmail,
  sendMailRating,
} from "../helpers/sendConfirmationEmail";

const Project = require("../models/project");
const Student = require("../models/student");
// CREATE
export const createUserCompany: RequestHandler = async (req, res) => {
  try {
    const { name, email, country, password } = req.body;
    let emailSearch = await User.find({ email });

        if (emailSearch.length) {
            throw new Error('Email ya registrado');
        }

        let hashPassword = await hash(password);
        let user = new User({
            name,
            email,
            country,
            password: hashPassword,
            admission: new Date(),
        });
        user = await user.save();
        sendConfirmationEmail(user);
        const rol = user.rol;
        let verify = user.verify;
        let id = user._id;
        let obj = { id: user._id, name: user.name };
        const token = jwtGenerator(obj);
        res.status(201).json({
            data: 'Ingreso exitoso',
            token,
            rol,
            verify,
            id,
            email,
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

// GET USERS
export const getUsersCompany: RequestHandler = async (req, res) => {
  try {
    const {
      limit = 10,
      init = 0,
      name,
      country,
      onlyActive = "true",
    } = req.query;

    const query: any = {};

    if (onlyActive === "true") query.state = true;

    if (name) query.name = { $regex: name, $options: "i" };

    if (country) query.country = { $regex: country, $options: "i" };

    const ignore: any = {
      password: false,
      gmail: false,
      github: false,
      rol: false,
    };

    const [total, usersCompany] = await Promise.all([
      User.countDocuments(query),
      User.find(query, ignore).skip(init).limit(limit),
    ]);
    res.status(200).json({
      total,
      usersCompany,
    });
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};

// GET USER
export const getUserCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, _id, email, country, image, website, premium ,project} =
            await User.findById(id);
        res.status(200).json({
            id: _id,
            name,
            country,
            email,
            image,
            website,
            premium,
            project
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

//PUT
export const updateUserCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, premium, password, ...user } = req.body;
        if (password) {
            let hashPassword = await hash(password); //modificacion
            user.password = hashPassword;
        }
        const userUpdated = await User.findByIdAndUpdate(id, user, {
            new: true,
        });
        res.status(200).json(userUpdated);
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

// DELETE
export const deleteUserCompany: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};

export const getCompanyProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { value }: any = req.query;

    const company = await User.findById(id).populate({
      path: "project",
    });

    let total = await company.project.length;
    let obj = { projects: company.project, total: total };
    if (value) {
      const val = parseInt(value);
      const limit = val * 6;
      const init = limit - 6;
      let pro;
      pro = company.project.slice(init, limit);
      obj = { projects: pro, total: total };
    }

    return res.status(200).json(obj);
  } catch (error: any) {
    res.status(400).send(formatError(error.message));
  }
};

export const finalProject: RequestHandler = async (req, res) => {
  try {
    const { uid: idProject } = req.body;
    const projectSearch: object | any = await Project.findById(idProject);

    projectSearch.stateOfProject = "Terminado";
    projectSearch.save();

    const id = projectSearch.accepts;

    projectSearch.accepts.map(async (accept: []) => {
      let user = await Student.findById(accept);

      sendMailRating(
        user.email,
        user.image,
        user.name,
        idProject,
        projectSearch.name,
        id
      );
      
    });
    res.sendStatus(200);
  } catch (error: any) {
    return res.status(500).send(formatError(error.message));
  }
};
