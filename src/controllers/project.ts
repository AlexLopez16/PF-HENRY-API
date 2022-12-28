import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
import { Query, InitialQuery, InitialProject } from '../interfaces/interfaces';
const Project = require('../models/project');
const Student = require('../models/student');
const Company = require('../models/company');

export const getProjects: RequestHandler = async (req, res) => {
    try {
        const {
            limit = 6,
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
            const category = categories.split(',');
            initialQuery.category = { $all: category };
        }
        if (stateProject) {
            const stateOfProject = stateProject.split(',');
            initialQuery.stateOfProject = { $all: stateOfProject };
        }
        let sort: any = {};
        if (orderBy) {
            sort[orderBy] = typeOfOrder;
        }

        const [total, projects]: [number, InitialProject[]] = await Promise.all(
            [
                Project.countDocuments(initialQuery),
                Project.find(initialQuery)
                    .sort(sort)
                    .limit(limit)
                    .skip(init)
                    .populate({
                        path: 'company',
                        select: 'name',
                    }),
            ]
        );

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
        const {
            name,
            description,
            participants,
            requirements,
            category,
            images,
        } = req.body;
        const data = {
            name,
            description,
            participants,
            requirements,
            images,
            //agregamos la request de user para hacer la relacion.
            company: req.user._id,
            category: category.toLowerCase(),
        };
        const project = new Project(data);
        await project.save();
        const company = await Company.findById(req.user._id);
        company.project = [...company.project, project._id];
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
        const verifyStudent = await Project.find({
            state: true,
            students: userId,
        });

        if (verifyStudent.length === 3) {
            throw new Error('Student is already in three projects');
        }
        const projects = await Project.find(query);

        if (!projects.length) throw new Error('project no found');
        let project = projects[0];
        if (
            !project.students.filter((s: any) => s.toString() == userId).length
        ) {
            project.students = [...project.students, userId];
            await project.save();
            const students = await Student.findById(userId);
            students.project = [...students.project, id];
            await students.save();
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
            })
            .populate({
                path: 'accepts',
                select: '-password',
            });
        if (!projects.length) throw new Error('project no found');
        let project = projects[0];
        console.log(project);

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
            { new: true }
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
        const categories = await Project.distinct('category');
        return res.status(200).json(categories);
    } catch (error: any) {
        return res.status(400).send(formatError(error.message));
    }
};

export const acceptStudentToProject: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { idstudent } = req.body;

        let project = await Project.findById(id);

        if (!project.students.includes(idstudent)) {
            throw new Error('no esta asociado');
        } else {
            project.accepts = [...project.accepts, idstudent]; //lo agrego a accept
            project.students = project.students.filter(
                (e: String) => e != idstudent
            ); //lo elimino de students
            project.save();
            const infoProject = await project.populate({
                path: 'students',
                select: '-password',
            });

            const studentSearch = await Student.findById(idstudent); //lo pone en working
            studentSearch.working = true;
            studentSearch.save();

            return res.status(200).json(infoProject);
        }
    } catch (error: any) {
        return res.status(400).send(formatError(error.message));
    }
};

export const DeleteAccepts: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { idstudent } = req.body;

        let project = await Project.findById(id);

        if (!project.accepts.includes(idstudent)) {
            throw new Error('no esta aceptado');
        } else {
            project.accepts = project.accepts.filter(
                (e: String) => e != idstudent
            ); //lo elimino de accepts
            project.save();

            const studentSearch = await Student.findById(idstudent);
            studentSearch.project = studentSearch.project.filter(
                (e: String) => e != id
            ); //borra el id del project en student.project
            studentSearch.working = false;
            studentSearch.save();

            return res.status(200).json(project);
        }
    } catch (error: any) {
        return res.status(400).send(formatError(error.message));
    }
};
