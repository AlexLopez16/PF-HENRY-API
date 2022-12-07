import { RequestHandler } from 'express';
// const User = require("../models/alumno");
const Project = require('../models/project');

export const getProject: RequestHandler = async (req, res) => {
  const { limit = 10, init = 0 } = req.query;
  const query = { state: true };

  const [total, project] = await Promise.all([
    Project.countDocuments(query),
    Project.find(query).skip(init).limit(limit),
  ]);

  res.status(200).json({
    total,
    project,
  });
};

export const createProject: RequestHandler = async (req, res) => {
  const { name, description, participants, requirements } = req.body;
  const project = new Project({
    name,
    description,
    participants,
    requirements,
  });
  await project.save();

  res.status(200).send(project);
};

export const addStudentToProject: RequestHandler = async (req, res) => {
  const { userId, projectId } = req.body;
  const project = await Project.findById(projectId);
  project.students = [...project.students, userId];
  await project.save();

  console.log(project);
  res.status(200).json(project);
};
