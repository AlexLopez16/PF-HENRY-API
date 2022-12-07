import { RequestHandler } from 'express';
// const User = require("../models/alumno");
const Project = require('../models/project');

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const { limit = 10, init = 0 } = req.query;
  const query = { state: true };

  const [total, projects] = await Promise.all([
    Project.countDocuments(query),
    Project.find(query).skip(init).limit(limit),
  ]);
  if(!projects){
    throw new Error('there are no projects')
  }

  return res.status(200).json({
    total,
    projects,
  });
  } catch (error:any) {
    return res.status(500).json(error.message)
  }
    
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const { ...body } = req.body;
    const data = {
    ...body
  };
  const project = new Project(data);
  await project.save();
  
   return res.status(200).send(project);
  } catch (error:any) {
     return res.send(error.message)
  }
    
};

export const addStudentToProject: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.body;
  const {id}=req.user
  const project = await Project.findById(projectId);
  if(!project)throw new Error ('project no found')
  project.students = [...project.students, id];
  await project.save();
  const infoProject=await project.populate('students')

  console.log(infoProject);
   return res.status(200).json(infoProject);
  } catch (error:any) {
    return res.send(error.message)
  }    
};


export const getProject:RequestHandler=async(req,res)=>{

}
export const deleteProject:RequestHandler=async(req,res)=>{

}