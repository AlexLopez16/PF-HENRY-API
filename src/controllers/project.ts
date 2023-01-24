import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
import {
    Query,
    InitialQuery,
    InitialProject,
    InitialQuery2,
    Query1,
} from '../interfaces/interfaces';
import { portalSession } from './checkout';
import { mailprojectDesarrollo, sendStudentApply } from '../helpers/sendConfirmationEmail';
const Project = require('../models/project');
const Student = require('../models/student');
const Company = require('../models/company');
const Response = require('../models/response');
const Invoice = require('../models/invoice');

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
        }: Query1 = req.query;

        // validar que el orderBy sea un campo valido
        if (orderBy && orderBy !== 'participants') {
            throw new Error('Orderby is not valid.');
        }

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            throw new Error('typeOfOrder is not valid.');
        }

        let initialQuery: InitialQuery = {
            state: true,
            stateOfProject: { $ne: 'En revision' },
        };

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
            initialQuery.stateOfProject = {
                $all: stateOfProject,
                $ne: 'En revision',
            };
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
            questions,
            category,
            images,
        }: any = req.body;
        const data = {
            name,
            description,
            participants,
            requirements,
            images,
            questions,
            //agregamos la request de user para hacer la relacion.
            company: req.user._id,
            category: category.toLowerCase(),
            admission: new Date(),
        };

        let _id = req.user._id;
        let project = await Company.find({ _id });
        if (project?.length > 3) {
            throw new Error('No puedes publicar mas de 3 proyectos');
        }

        let nameSearchProject = await Project.find({ name });
        if (nameSearchProject.length) {
            throw new Error('Nombre ya utilizado');
        }

        const result = await Project.aggregate([
            { $match: { company: req.user._id } },
            {
                $group: {
                    _id: '$company',
                    maxDate: { $max: '$admission' },
                },
            },
        ]);

        const date = new Date();

        let difBetweenDates: number | undefined;
        if (result[0] && result[0].maxDate) {
            difBetweenDates = Math.round(
                (date.getTime() - result[0].maxDate.getTime()) /
                (1000 * 3600 * 24)
            );
            console.log(difBetweenDates);
        }
        // console.log('pro', pro);
        const compa = await Company.findById(req.user._id);
        const invoice = await Invoice.find({ company: req.user._id })
            .sort({
                date: 'desc',
            })
            .skip(0)
            .limit(1);

        console.log(invoice);

        if (invoice.length) {
            const operation = {
                company: req.user._id,
                admission: {
                    $gte: invoice[0].date,
                    $lte: invoice[0].date + 30,
                },
            };

            let total = await Project.find(operation).count();
            console.log('total', total);
            if (compa.premium && total >= 3) {
                throw new Error(
                    'No puedes publicar mas de 3 proyectos al mes '
                );
            }
        }

        if (
            difBetweenDates != undefined &&
            difBetweenDates < 30 &&
            !compa.premium
        ) {
            throw new Error(
                'Tienes que ser premium, si quieres crear mas de un proyecto al mes');
        } else {
            const project = new Project(data);
            await project.save();
            const company = await Company.findById(req.user._id);
            company.project = [...company.project, project._id];
            await company.save();
            return res.status(200).send(project);
        }
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send(formatError(error.message));
    }
};

export const addStudentToProject: RequestHandler = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const studentId = req.user._id;
        const query = { state: true, _id: projectId };

        const studentIsWorking = await Student.find({
            state: true,
            // Buscamos al usuario por id.
            _id: studentId,
            // Buscamos que tenga en el wordkin un proyecto.
            working: { $exists: true, $not: { $size: 0 } },
        });
        // Error si el estudiante esta trabajando.
        if (studentIsWorking.length)
            throw new Error('Estudiante actualmente trabajando');

        // Verificamos que el proyecto exista.
        const projects = await Project.find(query);
        if (!projects.length) throw new Error('Proyecto no encontrado');

        // Seleccionamos el proyecto.
        let project = projects[0];
        if (
            !project.students.filter((s: any) => s.toString() == studentId)
                .length
        ) {
            project.students = [...project.students, studentId];
            await project.save();
            const students = await Student.findById(studentId);
            students.project = [...students.project, projectId];
            await students.save();

            await sendStudentApply({
                email: students.email,
                name: students.name,
            });
            const infoProject = await project.populate({
                path: 'students',
                select: '-password',
            });
            return res.status(200).json(infoProject);
        } else {
            throw new Error('El estudiante ya esta en el proyecto');
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
                populate: {
                    path: 'responses',
                },
            })
            .populate({
                path: 'company',
                select: '-password',
            })
            .populate({
                path: 'accepts',
                select: '-password',
            })
            .populate({
                path: 'reviews',
                populate: {
                    path: 'student',
                    select: 'name lastName image',
                },
            })
            .populate({
                path: 'responses',
            });
        if (!projects.length) throw new Error('proyecto no encontrado');
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
        if (!projects.length) throw new Error('Proyecto no encontrado');
        let project = projects[0];
        project.state = false;
        await project.save();
        return res.status(200).json({ msg: 'Proyecto borrado scon exito' });
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

        if (!editUpdate) throw new Error('Proyecto no encontrado');
        if (body.stateOfProject === "En desarrollo") {
            mailprojectDesarrollo(body.project)
        }


        // return res.status(200).send(editUpdate);
        return res.status(200).send("enviado");
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
        const { id: projectId } = req.params;
        const companyId = req.user._id;
        const { studentId } = req.body;

        // Buscamos al estudiante.
        const student = await Student.find({
            state: true,
            // Buscamos al usuario por id.
            _id: studentId,
            // Buscamos que tenga en el working un proyecto.
            working: { $exists: true, $not: { $size: 0 } },
        });
        // Error si el estudiante esta trabajando.
        if (student.length) throw new Error('Trabajando actualmente');
        // Buscamos el proyecto que este en state en true donde su compania concuerde con la compania logueada.
        let projectById = await Project.find({
            _id: projectId,
            company: companyId,
            state: true,
        });
        // Si la consulta no devuelve nada, significa que una compania que no es la que esta logueada, esta intentando aceptar a un estudiante de un proyecto que no es de el,por tal motivo se lanza error
        if (!projectById.length) {
            throw new Error('No puede aceptar a este estudiante');
        }
        let project = projectById[0];
        // Rechazamos si se quiere asociar un estudiante que no esta en la lista.
        if (!project.students.includes(studentId)) {
            throw new Error('Estudiante no encontrado');
        } else {
            // Verificamos si ya no esta en la lista de asociados.
            if (project.accepts.includes(studentId)) {
                throw new Error('Ya esta aceptado');
            }
            // Agregamos el estudiante a la lista de aceptados.
            project.accepts = [...project.accepts, studentId];
            // project.students = project.students.filter(
            //     (e: String) => e != studentId
            // );
            await project.save();
            // Ahora asociamos el working del estuaiante al proyecto.
            const studentWorking = await Student.findById(studentId);
            studentWorking.working = [projectId];
            await studentWorking.save();
            const infoProject = await Project.findById(projectId)
                .populate({
                    path: 'accepts',
                    select: '-password',
                })
                .populate({
                    path: 'students',
                    select: '-password',
                    populate: {
                        path: 'responses',
                    },
                });

            return res.status(200).json(infoProject);
        }
    } catch (error: any) {
        return res.status(400).send(formatError(error.message));
    }
};

export const DeleteAccepts: RequestHandler = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { studentId } = req.body;
        const companyId = req.user._id;
        // Buscamos el proyecto que este en state en true donde su compania concuerde con la compania logueada.
        let projectById = await Project.find({
            _id: projectId,
            company: companyId,
            state: true,
        });
        // Si la consulta no devuelve nada, significa que una compania que no es la que esta logueada, esta intentando borrar a un estudiante de un proyecto que no es de el,por tal motivo se lanza error

        if (!projectById.length) {
            throw new Error('No puede borrar a este estudiante');
        }
        let project = projectById[0];
        // Si no esta en la lista de estudiantes.
        if (!project.students.includes(studentId))
            throw new Error("Estudiante no encontrado en la lista 'Students'");
        // Si no esta en la lista de aceptados.
        if (!project.accepts.includes(studentId))
            throw new Error("Estudiante no encontrado en la lista  'Accepts'");
        // En caso de que este en la lista de accepts, lo eliminamos.
        project.accepts = project.accepts.filter((e: string) => e != studentId);
        // Guardamos los cambios nuevos.
        await project.save();
        // Ahora eliminamos la asociacion del estudiante al proyecto.
        const student = await Student.findById(studentId);
        student.working = [];
        await student.save();
        const infoProject = await Project.findById(projectId)
            .populate({
                path: 'accepts',
                select: '-password',
            })
            .populate({
                path: 'students',
                select: '-password',
                populate: {
                    path: 'responses',
                },
            });
        return res.status(200).json(infoProject);
    } catch (error: any) {
        return res.status(400).send(formatError(error.message));
    }
};

export const UnapplyStudent: RequestHandler = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { studentId } = req.body;

        // Buscamos el proyecto.
        let project = await Project.findById(projectId);
        // Si no esta en la lista de estudiantes.
        if (!project.students.includes(studentId)) {
            throw new Error("Estudiante no encontrado en la lista 'Students'");
        }

        // Borramos las responses a ese proyecto.
        let response = await Response.findOne({ studentId, projectId });
        await Response.deleteOne({ studentId, projectId });
        if (response._id == response._id) console.log('iguales');

        // En caso de que este en la lista de estudiantes, lo eliminamos.
        project.students = project.students.filter(
            (e: string) => e != studentId
        );
        // En caso de que este en la lista de accepts, lo eliminamos.
        project.accepts = project.accepts.filter((e: String) => e != studentId);

        project.responses.pull({ _id: response._id });

        // Guardamos los cambios nuevos.
        await project.save();
        const student = await Student.findById(studentId);
        // Eliminamos la asociacion del estudiante al proyecto.
        console.log(projectId);
        student.project = student.project.filter((e: String) => e != projectId);

        // Eliminamos las respuestas que tiene en ese proyecto.
        // student.responses =  student.responses.filter((e: String) => e != response._id)
        await student.responses.pull({ _id: response._id });

        console.log(student.responses);
        // Si no queremos que aplique, entonces no queremos aceptarlo.
        student.working = [];
        await student.save();

        return res.status(200).json(project);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

export const getAllProjects: RequestHandler = async (req, res) => {
    try {
        const {
            limit = '6',
            init = '0',
            name,
            tecnologies,
            orderBy,
            typeOfOrder = 'asc',
            categories,
            stateProject,
        }: Query = req.query;

        let Limit = parseInt(limit);
        let Init = parseInt(init);
        // validar que el orderBy sea un campo valido
        if (orderBy && orderBy !== 'participants') {
            throw new Error('Orderby is not valid.');
        }

        if (typeOfOrder !== 'asc' && typeOfOrder !== 'desc') {
            throw new Error('typeOfOrder is not valid.');
        }

        let initialQuery: InitialQuery2 = {};
        let companyquery: InitialQuery2 = {};

        if (tecnologies) {
            const requirements: string[] = tecnologies.split(',');
            initialQuery.requirements = { $all: requirements };
            companyquery.requirements = { $all: requirements };
        }
        if (categories) {
            const category = categories.split(',');
            initialQuery.category = { $all: category };
            companyquery.category = { $all: category };
        }
        let stateOfProject;
        if (stateProject) {
            stateOfProject = stateProject.split(',');
            initialQuery.stateOfProject = { $all: stateOfProject };
            companyquery.stateOfProject = { $all: stateOfProject };
        }
        let sort: any = {};
        if (orderBy) {
            sort[orderBy] = typeOfOrder;
        }

        if (name) {
            let queryWithCount = [
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        let: { name: '$name' },
                        pipeline: [
                            {
                                $match: {
                                    name: { $regex: name, $options: 'i' },
                                },
                            },
                        ],
                        as: 'company',
                    },
                },
                {
                    $match: companyquery,
                },
                {
                    $unionWith: {
                        coll: 'projects',
                        pipeline: [
                            {
                                $match: initialQuery,
                            },
                            {
                                $lookup: {
                                    from: 'companies',
                                    localField: 'company',
                                    foreignField: '_id',
                                    as: 'company',
                                },
                            },
                        ],
                    },
                },
                {
                    $count: 'count',
                },
            ];
            let queryWithoutCount = [
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        let: { name: '$name' },
                        pipeline: [
                            {
                                $match: {
                                    name: { $regex: name, $options: 'i' },
                                },
                            },
                        ],
                        as: 'company',
                    },
                },
                {
                    $match: companyquery,
                },
                {
                    $unionWith: {
                        coll: 'projects',
                        pipeline: [
                            {
                                $match: initialQuery,
                            },
                            {
                                $lookup: {
                                    from: 'companies',
                                    localField: 'company',
                                    foreignField: '_id',
                                    as: 'company',
                                },
                            },
                        ],
                    },
                },
            ];
            companyquery.company = { $size: 1 };
            initialQuery.name = { $regex: name, $options: 'i' };
            const [total, projects]: [any, InitialProject[]] =
                await Promise.all([
                    Project.aggregate(queryWithCount),
                    Project.aggregate(queryWithoutCount)
                        .limit(Limit)
                        .skip(Init),
                ]);
            console.log(projects[0]);
            let tol;
            if (total[0]) {
                tol = total[0].count;
            } else {
                tol = 0;
            }
            return res.status(200).json({
                projects,
                total: tol,
            });
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
            projects,
            total,
        });
    } catch (error: any) {
        //use any because type of error can be undefined
        console.log(error);
        return res.status(500).json(formatError(error.message));
    }
};

export const deleteMultiProject: RequestHandler = async (req, res) => {
    try {
        const { ids } = req.body;
        ids.map(async (e: string) => {
            const query = { _id: e };
            const projects = await Project.find(query);
            if (!projects.length) throw new Error('project no found');
            let project = projects[0];
            project.state === true
                ? (project.state = false)
                : (project.state = true);
            project.state = !project.state;
            await project.save();
        });
        return res.status(200).json({ msg: 'Proyectos borrados con exito' });
    } catch (error: any) {
        return res.status(500).send(formatError(error.message));
    }
};
