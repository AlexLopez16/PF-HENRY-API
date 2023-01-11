import { RequestHandler } from 'express';
const User = require('../models/company');
const Review = require('../models/review');
import { hash } from '../helpers/hash';
import { jwtGenerator } from '../helpers/jwt';
import { formatError } from '../utils/formatErros';
import {
    emailForCompany,
    sendMailRating,
} from '../helpers/sendConfirmationEmail';

const Project = require('../models/project');
const Student = require('../models/student');
// CREATE
export const createUserCompany: RequestHandler = async (req, res) => {
    try {
        const { name, email, country, password } = req.body;
        let emailSearchCompany = await User.find({ email });
        let emailSearchStudent = await Student.find({ email });
        if (emailSearchCompany.length || emailSearchStudent.length) {
            throw new Error('Email ya registrado');
        }

        let hashPassword = await hash(password);
        let user = new User({
            name,
            email,
            country,
            password: hashPassword,
            admission: new Date(),
        });
        user = await user.save();

        await emailForCompany(user);

        const rol = user.rol;
        let verify = user.verify;
        let id = user._id;
        let obj = { id: user._id, name: user.name };
        const token = jwtGenerator(obj);
        res.status(201).json({
            data: 'Empresa creada con exito',
            token,
            rol,
            verify,
            id,
            email,
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

// GET USERS
export const getUsersCompany: RequestHandler = async (req, res) => {
    try {
        const {
            limit = 6,
            init = 0,
            name,
            country,
            onlyActive = 'true',
        } = req.query;

        const query: any = {};

        if (onlyActive === 'true') query.state = true;

        if (name) query.name = { $regex: name, $options: 'i' };

        if (country) query.country = { $regex: country, $options: 'i' };

        const ignore: any = {
            password: false,
            gmail: false,
            github: false,
            rol: false,
        };

        const [total, usersCompany] = await Promise.all([
            User.countDocuments(query),
            User.find(query, ignore).skip(init).limit(limit),
        ]);
        res.status(200).json({
            total,
            usersCompany,
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

// GET USER
export const getUserCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, _id, email, country, image, website, premium, project } =
            await User.findById(id);
        res.status(200).json({
            id: _id,
            name,
            country,
            email,
            image,
            website,
            premium,
            project,
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

/**
 * By Sciangula Hugo:
 * NOTA: getDetailCompany(), va a traer la info de la empresa.
 */

export const getDetailCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const ignore = {
            password: false,
            premium: false,
            verify: false,
            gmail: false,
            invoice: false,
            admission: false,
        };
        const company = await User.findById(id, ignore)
            .populate({
                path: 'project',
                select: 'name description participants stateOfProject category',
                populate: {
                    path: 'reviews',
                    populate: {
                        path: 'student',
                        select: 'name lastName image',
                    },
                },
            })
            .populate({
                path: 'project',
                populate: {
                    path: 'reviews',
                    populate: {
                        path: 'project',
                        select: 'name',
                    },
                },
            });
        // Sacamos el promedio de sus proyectos.
        let companyRating = 0;
        let projectRating = 0;
        let totalVotes = 0;
        // Average = Promedio
        let projectAverage = 0;
        let companyAverage = 0;
        // Revies
        let reviews: any = [];

        if (company) {
            company.project.forEach((e: any) => {
                e.reviews.forEach((i: any) => {
                    reviews = [...reviews, i];
                    companyRating += i.ratingCompany;
                    projectRating += i.ratingProject;
                });
            });
        }

        totalVotes = reviews.length;
        companyAverage = Math.round(companyRating / totalVotes);
        projectAverage = Math.round(projectRating / totalVotes);
        // console.log(company);
        res.status(200).json({
            reviews: reviews,
            company,
            ratingCompany: companyAverage,
            ratingProjects: projectAverage,
        });
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

//PUT
export const updateUserCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, premium, password, ...user } = req.body;
        if (password) {
            let hashPassword = await hash(password); //modificacion
            user.password = hashPassword;
        }
        const userUpdated = await User.findByIdAndUpdate(id, user, {
            new: true,
        });
        res.status(200).json(userUpdated);
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};
// DELETE
export const deleteUserCompany: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { state: false },
            { new: true }
        );

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).send(formatError(error.message));
    }
};

export const getCompanyProject: RequestHandler = async (req, res) => {
    try {
        const { id } = req.user;
        const { value }: any = req.query;

        const company = await User.findById(id).populate({
            path: 'project',
        });

        let total = await company.project.length;
        let obj = { projects: company.project, total: total };
        if (value) {
            const val = parseInt(value);
            const limit = val * 6;
            const init = limit - 6;
            let pro;
            pro = company.project.slice(init, limit);
            obj = { projects: pro, total: total };
        }

        return res.status(200).json(obj);
    } catch (error: any) {
        res.status(400).send(formatError(error.message));
    }
};

export const finalProject: RequestHandler = async (req, res) => {
    try {
        const { uid: idProject } = req.body;
        const projectSearch: object | any = await Project.findById(idProject);

        projectSearch.stateOfProject = 'Terminado';
        projectSearch.save();
        projectSearch?.accepts?.map(async (idStudent: string) => {
            let user = await Student.findById(idStudent);
            console.log(idStudent);
            sendMailRating(
                user.email,
                user.image,
                user.name,
                idProject,
                projectSearch.name,
                idStudent
            );
        });
        res.status(200).json({ msg: 'Proyecto finalizado.' });
    } catch (error: any) {
        return res.status(500).send(formatError(error.message));
    }
};

export const reclutamientoToDesarrollo: RequestHandler = async (req, res) => {
    try {
        const {id} = req.body;
        let _id=id
        const projectSearch: object | any = await Project.findById(_id);
        projectSearch.stateOfProject === 'En revision'
        ? projectSearch.stateOfProject = 'En desarrollo'
        : projectSearch.stateOfProject === 'En desarrollo'
        ? projectSearch.stateOfProject = 'En revision': "";
        projectSearch.save();
  
        res.status(200).json({ msg: 'Cambio de estado exitoso' });
    } catch (error: any) {
        return res.status(500).send(formatError(error.message));
    }
};