import { RequestHandler } from 'express';
const Project = require('../models/project');
import { formatError } from '../utils/formatErros';
const Student = require('../models/student');

interface Query {
  limit?: number;
  init?: number;
  name?: string;
  tecnologies?: string;
  orderBy?: string;
  typeOfOrder?: string;
  category?: string;
  stateOfProject?: boolean;
}

interface InitialQuery {
  state: boolean;
  name?: {};
  requirements?: {};
  category?: {};
  stateOfProject?: {};
}

declare module namespace {

  export interface Error {
      msg: string;
  }

  export interface RootObject {
      errors: Error[];
  }

}

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const {
      limit = 10,
      init = 0,
      name,
      tecnologies,
      orderBy,
      typeOfOrder = 'asc',
      category,
      stateOfProject,
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
    if (category) {
      initialQuery.category = { $regex: category, $options: 'i' };
    }
    if (stateOfProject) {
      initialQuery.stateOfProject = { $regex: stateOfProject, $options: 'i' };
    }

    let sort: any = {};
    if (orderBy) {
      sort[orderBy] = typeOfOrder;
    }

    const [total, projects] = await Promise.all([
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
    return res.status(500).json(formatError(error.message) );
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

    if (verifyStudent.length) {
      throw new Error('Student is already in a project');
    }
    const projects = await Project.find(query);
    if (!projects.length) throw new Error('project no found');
    let project = projects[0];
    project.students = [...project.students, userId];
    await project.save();
    await Student.findByIdAndUpdate(userId, { project: id });

    const infoProject = await project.populate({
      path: 'students',
      select: '-password',
    });
    return res.status(200).json(infoProject);
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
