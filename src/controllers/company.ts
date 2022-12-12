import { RequestHandler } from 'express';
const User = require('../models/company');
import { hash } from '../helper/hash';
import { jwtGenerator } from '../helper/jwt';
import { formatError } from '../utils/formatErros';
import { sendConfirmationEmail } from '../helper/sendConfirmationEmail';

// CREATE
export const createUserCompany: RequestHandler = async (req, res) => {
  try {
    const { name, email, country, password } = req.body;
    let hashPassword = await hash(password);
    let user = new User({ name, email, country, password: hashPassword });
    let verify = user.verify;
    let id = user._id;
    user = await user.save();
    sendConfirmationEmail(user);
    const rol = user.rol;
    const token = jwtGenerator(user._id, user.name);
    res.status(201).json({
      data: 'Successfull Sing up',
      token,
      rol,
      verify,
      id,
    });
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};

// GET USERS
export const getUsersCompany: RequestHandler = async (req, res) => {
  try {
    const { limit = 10, init = 0 } = req.query;
    const query = { state: true };
    const ignore: any = {
      password: false,
      state: false,
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
    const { name, _id, email, country } = await User.findById(id);

    res.status(200).json({
      id: _id,
      name,
      country,
      email,
    });
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};

//PUT
export const updateUserCompany: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, country, premium, password, ...user } = req.body;
    let hashPassword = await hash(password);
    if (password) {
      user.password = hashPassword;
    }
    const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });
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
      { new: true },
    );

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};
