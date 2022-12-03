import { RequestHandler } from "express";
// const User = require("../models/alumno");

export const getProjects: RequestHandler = async (req, res) => {
  return res.status(200).json({
    message: "ruta protegida",
  });
};
