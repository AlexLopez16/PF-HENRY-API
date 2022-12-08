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
    ...body, 
    //agregamos la request de user para hacer la relacion.
    company: req.user._id
  };
  const project = new Project(data);
  await project.save();
  
   return res.status(200).send(project);
  } catch (error:any) {
     return res.status(500).send(error.message)
  }
    
};

export const addStudentToProject: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.body;
  const id=req.user._id
  const project = await Project.findById(projectId);
  if(!project)throw new Error ('project no found')
  if(!project.students.filter((s:any)=>s.toString()==id).length){
  project.students = [...project.students, id];
  await project.save();
  const infoProject=await project.populate({path:'students', select:"-password"})
   return res.status(200).json(infoProject);
  }
  else {throw new Error ('student is in the project')}
  } catch (error:any) {
    return res.status(400).send(error.message)
  }    
};


export const getProject:RequestHandler=async(req,res)=>{
    try {
        const {id}=req.params
        
        const project = await Project.findById(id).populate({path:'students', select:"-password"});
        if(!project)throw new Error ('project no found')
        return res.status(200).json(project);

    } catch (error:any) {
        return res.status(400).send(error.message)
    }

}
export const deleteProject:RequestHandler=async(req,res)=>{
  try { 
    const {id}=req.params
    const project = await Project.findById(id)
    if(!project)throw new Error ('project no found')
    project.state=false;
    await project.save()
    return res.status(200).json({msg:"project sucessfully deleted"});
  } catch (error:any) {
    return res.status(500).send(error.message)
  }
}