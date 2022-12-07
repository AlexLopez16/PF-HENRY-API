import { RequestHandler } from 'express';
// const User = require("../models/alumno");
const Project = require('../models/project');

export const createProject: RequestHandler = async (req, res) => {
    const {...body } = req.body;
    console.log(req.user)
    const data={
        ...body,
        students:req.user._id

    }
    const project = new Project(data);
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
