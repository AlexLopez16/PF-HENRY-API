import { RequestHandler } from 'express';
const User = require('../models/company');
import { hash } from '../helper/hash';
import { jwtGenerator } from '../helper/jwt';

export const getUsersCompany: RequestHandler = async (req, res) => {
  const { limit = 10, init = 0 } = req.query;
  const query = { state: true };

  const [total, usersCompany] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(init).limit(limit),
  ]);

  res.status(200).json({
    total,
    usersCompany,
  });
};

export const getUserCompany: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, _id, email, country } = await User.findById(id);

  res.status(200).json({
    id: _id,
    name,
    country,
    email,
  });
};

export const createUserCompany: RequestHandler = async (req, res) => {
  const { name, email, country, password } = req.body;
  let hashPassword = await hash(password);
  let user = new User({ name, email, country, password: hashPassword });
  user = await user.save();
  const rol = user.rol;
  const token = jwtGenerator(user._id, user.name);
  res.status(201).json({
    data: 'Successfull Sing up',
    token,
    rol,
  });
};

export const updateUserCompany: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { email, country, premium, password, ...user } = req.body;
  let hashPassword = await hash(password);
  if (password) {
    user.password = hashPassword;
  }

  const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });

  res.status(200).json(userUpdated);
};

export const deleteUserCompany: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true },
  );

  res.status(200).json(user);
};
