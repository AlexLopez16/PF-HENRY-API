import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
import { Query, InitialQuery, InitialProject } from '../interfaces/interfaces';
const Project = require('../models/project');
const Student = require('../models/student');
const Company=require('../models/company')


export const getProjects: RequestHandler = async (req, res) => {
  try {
    const {
      limit = 10,
      init = 0,
      name,
      tecnologies,
      orderBy,
      typeOfOrder = 'asc',
      categories,
      stateProject,
    }: Query = req.query;


    // validar que el orderBy sea un campo valido
    if (orderBy && orderBy !== 'participants') {
      throw new Error('Orderby is not valid.');
    }

    if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
      throw new Error('typeOfOrder is not valid.');
    }

    let initialQuery: InitialQuery = { state: true };

    if (name) {
      initialQuery.name = { $regex: name, $options: 'i' };
    }
    if (tecnologies) {
      const requirements: string[] = tecnologies.split(',');
      initialQuery.requirements = { $all: requirements };
    }
    if (categories) {
      const category = categories.split(",");
      initialQuery.category = { $all: category};
    }
    if (stateProject) {
      const stateOfProject = stateProject.split(",");
      initialQuery.stateOfProject = { $all: stateOfProject};
    }
    let sort: any = {};
    if (orderBy) {
      sort[orderBy] = typeOfOrder;
    }

    const [total, projects]: [number, InitialProject[]] = await Promise.all([
      Project.countDocuments(initialQuery),
      Project.find(initialQuery).sort(sort).skip(init).limit(limit).populate({
        path: 'company',
        select: 'name',
      }),
    ]);
    return res.status(200).json({
      total,
      projects,
    });
  } catch (error: any) {
    //use any because type of error can be undefined
    return res.status(500).json(formatError(error.message));
  }
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const { ...body } = req.body;
    const data = {
      ...body,
      //agregamos la request de user para hacer la relacion.
      company: req.user._id,
    };
    const project = new Project(data);
    await project.save();
    const company=await Company.findById(req.user._id)
    company.project=[...company.project,project._id]
    await company.save();
    return res.status(200).send(project);
  } catch (error: any) {
    return res.status(500).send(formatError(error.message));
  }
};

export const addStudentToProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const query = { state: true, _id: id };
    const verifyStudent = await Project.find({ state: true, students: userId });


    if (verifyStudent.length===3) {
      throw new Error("Student is already in three projects");
    }
    const projects = await Project.find(query);
    if (!projects.length) throw new Error('project no found');
    let project = projects[0];
    if (!project.students.filter((s: any) => s.toString() == userId).length) {
      project.students = [...project.students, userId];

      await project.save();
      await Student.findByIdAndUpdate(userId, { project: id });

      const infoProject = await project.populate({
        path: 'students',
        select: '-password',
      });
      return res.status(200).json(infoProject);
    } else {
      throw new Error('student is in the project');
    }
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const getProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { state: true, _id: id };

    const projects = await Project.find(query)
      .populate({
        path: 'students',
        select: '-password',
      })
      .populate({
        path: 'company',
        select: '-password',
      });
    if (!projects.length) throw new Error('project no found');
    let project = projects[0];
    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { state: true, _id: id };
    const projects = await Project.find(query);
    if (!projects.length) throw new Error('project no found');
    let project = projects[0];
    project.state = false;
    await project.save();
    return res.status(200).json({ msg: 'project sucessfully deleted' });
  } catch (error: any) {
    return res.status(500).send(formatError(error.message));
  }
};

export const editProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { state: true, _id: id, company: req.user._id };
    const { ...body } = req.body;
    const editUpdate = await Project.findByIdAndUpdate(
      query,
      { ...body },
      { new: true },
    ).populate({
      path: 'company',
      select: '-password',
    });

    if (!editUpdate) throw new Error('project no found');
    return res.status(200).send(editUpdate);
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const getCategory: RequestHandler = async (req, res) => {
  try {
    const projects = await Project.find();
    const categories = projects.map(({ category }: any) => category.toLowerCase())
    return res.status(200).json(categories);
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const acceptStudentToProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const searchStudent = await Project.find({ state: true, students: id });
    if (!searchStudent.length) {
      throw new Error("no esta asociado");
    }
    searchStudent[0].accepts = [...searchStudent[0].accepts, id]//lo agrego a accept
    searchStudent[0].students = searchStudent[0].students.filter((e: String) => e != id)
    searchStudent[0].save()
    return res.status(200).json("alumno aceptado");

  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const FromAcceptoToStudent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const searchStudent = await Project.find({ state: true, accepts: id });
    if (!searchStudent.length) {
      throw new Error("no esta aceptado");
    }
    searchStudent[0].students = [...searchStudent[0].students, id]//lo agrego a students
    searchStudent[0].accepts = searchStudent[0].accepts.filter((e: String) => e != id)
    searchStudent[0].save()
    return res.status(200).json("alumno movido");
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const getPostulated: RequestHandler = async (req, res) => {
  try {
    const {id}=req.params
    const project= await Project.findById(id);
    return res.status(200).json(project.students);
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

export const getAccepts: RequestHandler = async (req, res) => {
  try {
    const {id}=req.params
    const project= await Project.findById(id);
    return res.status(200).json(project.accepts);
  } catch (error: any) {
    return res.status(400).send(formatError(error.message));
  }
};

