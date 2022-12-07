import { RequestHandler } from 'express';
const User = require('../models/student');
import { hash } from '../util/hash';

export const getUsers: RequestHandler = async (req, res) => {
  const { limit = 5, init = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(init).limit(limit),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, _id, email } = await User.findById(id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
};

export const createUser: RequestHandler = async (req, res) => {
  let { name, lastName, birth, email, password } = req.body;
  let hashPassword = await hash(password);
  birth = new Date(birth);
  const user = new User({
    name,
    lastName,
    birth,
    email,
    password: hashPassword,
  });
  await user.save();

  res.status(201).json({
    user,
  });
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    state,
    gmail,
    github,
    slack,
    premium,
    password,
    age,
    ...user
  } = req.body;

  if (password) {
    let hashPassword = await hash(password);
    user.password = hashPassword;
  }

  const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });

  res.status(200).json(userUpdated);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true },
  );

  res.status(200).json(user);
};
