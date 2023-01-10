import { RequestHandler } from 'express';
import mongoose from 'mongoose';
const Admin = require('../models/admin');
const Student = require('../models/student');
const Company = require('../models/company');
const Project = require('../models/project');
import { hash } from '../helpers/hash';
import { jwtGenerator } from '../helpers/jwt';
import {
    mailprojectCancel,

    sendCompanyReject,

    sendConfirmationEmail,
} from '../helpers/sendConfirmationEmail';

import { formatError } from '../utils/formatErros';




// CREATE
export const createAdmin: RequestHandler = async (req, res) => {
  try {
    let { name, lastName, email, password } = req.body;
    let emailSearch = await Admin.find({ email });
    
    if (emailSearch.length) {
      throw new Error('Email ya registrado');
    }

    let hashPassword = await hash(password);
    let user = new Admin({
      name,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();

    let rol = user.rol;
    let verify = user.verify;
    let id = user._id;
    let obj = { id: user._id, name: user.name };
    const token = jwtGenerator(obj);
    res.status(201).json({
      data: 'Sucessful singup',
      token,
      id,
      rol,
      verify,
      email,
    });
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }
};

export const getAdmin: RequestHandler = async (req, res) => {
  try {
    const { limit = 10, init = 0 } = req.query;
    const query = {};
    const ignore: any = {
      password: false,
      gmail: false,
      github: false,
      rol: false,
    };
    const [total, admins] = await Promise.all([
      Admin.countDocuments(query),
      Admin.find(query, ignore).skip(init).limit(limit),
    ]);
    res.status(200).json({
      total,
      admins,
    });
  } catch (error: any) {
    res.status(500).send(formatError(error.message));
  }
};

export const getAdminById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            lastName,
            _id,
            email,
            image,
            description,
            tecnologies,
            project,
            company,
            country,
        } = await Admin.findById(id);
        res.status(200).json({
            id: _id,
            name,
            lastName,
            country,
            image,
            description,
            email,
            tecnologies,
            project,
            company,
        });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

export const updateAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        let { rol, email, password, ...admin } = req.body;

        if (password) {
            let hashPassword = await hash(password);
            admin.password = hashPassword;
        }

        await Admin.findByIdAndUpdate(id, admin, {
            new: true,
        });

        res.status(200).json(admin);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Damos la opcion de borrar (cambiar su estatus a false) al admin.
export const deleteAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.body;

        let searchId = await Student.findById(id);
        if (!searchId) {
            searchId = await Company.findById(id);
        }
        if (!searchId) {
            searchId = await Admin.findById(id);
        }
        if (!searchId) {
            searchId = await Project.findById(id);
        }

        searchId.state = !searchId.state;
        await searchId.save();
        res.status(200).json(searchId);
    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};

export const AprovedProject: RequestHandler = async (req, res) => {
    try {
        const { id } = req.body;

        let searchId = await Project.findById(id);
        searchId.stateOfProject === 'En revision'
            ? (searchId.stateOfProject = 'Reclutamiento')
            : // :searchId.stateOfProject === "Reclutamiento"
            // ?searchId.stateOfProject = "En revision"
            '';
        await searchId.save();
        console.log(searchId);

        res.status(200).json(searchId);
    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};

export const deniedProject: RequestHandler = async (req, res) => {
    try {
        const { id } = req.body;

        let searchId = await Project.findById(id);
        console.log(searchId);

        // searchId.remove()

        await searchId.save();
        console.log(searchId);

        res.status(200).json(searchId);
    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};

export const sendEmailCompanyforProjectDenied: RequestHandler = async (
    req,
    res
) => {
    try {
        const { idPrj, values } = req.body;
        let id = idPrj;

    let proyecto = await Project.findById(idPrj)
    let compania = await Company.findById(proyecto.company)

    // Quitamos de la relacion el projecto a a eliminar
    await compania.project.pull({ _id: idPrj })
    await compania.save()

    proyecto.remove() // elimino el proyecto de la base
    await proyecto.save();
    mailprojectCancel(compania, values, proyecto)

    // res.status(200).json(compania);
    res.status(200).json("Proyecto removido");
  } catch (error: any) {
    res.status(404).json(formatError(error.message));
  }
};

type GraphResponse = {
    students: {
        state: GraphData;
    };
    projects: {
        state: GraphData;
    };
    companies: {
        state: GraphData;
        premium: GraphData;
    };
};

type GraphData = {
    datasets: Dataset[];
    labels: string[];
};

type Dataset = {
    data: number[];
    backgroundColor: string[];
};

export const getChart: RequestHandler = async (req, res) => {
    try {
        const studentData = await Student.find().select({ state: 1 }).exec();

        const projectData = await Project.find()
            .select({ stateOfProject: 1 })
            .exec();

        const companiesData = await Company.find()
            .select({ state: 1, premium: 1 })
            .exec();

        const response: GraphResponse = {
            students: {
                state: getGraphData(
                    studentData.map((i: any) =>
                        i.state ? 'Activo' : 'Inactivo'
                    )
                ),
            },
            projects: {
                state: getGraphData(
                    projectData.map((i: any) => i.stateOfProject)
                ),
            },
            companies: {
                state: getGraphData(
                    companiesData.map((i: any) =>
                        i.state ? 'Activo' : 'Inactivo'
                    )
                ),
                premium: getGraphData(
                    companiesData.map((i: any) =>
                        i.premium ? 'Premium' : 'No premium'
                    )
                ),
            },
        };

        res.status(200).json(response);
    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};

const getGraphData = (items: string[]): GraphData => {
    const res: GraphData = {
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                ],
            },
        ],
        labels: [],
    };

    for (let item of items) {
        let ix = res.labels.indexOf(item);

        if (ix === -1) {
            ix = res.labels.push(item) - 1;
            res.datasets[0].data.push(1);
            continue;
        }

        res.datasets[0].data[ix]++;
    }

    return res;
};

export const getCompanies: RequestHandler = async (req, res) => {
    try {
        const companies = await Company.find({ verify: false, state: true });
        if (!companies.length)
            return res.status(404).json(formatError('No companies for verify'));

        res.status(200).json(companies);
    } catch (error: any) {
        console.log(error);
        res.status(500).json(formatError(error));
    }
};

export const verifyCompany: RequestHandler = async (req, res) => {
    try {
        const { id, acept } = req.body;

        if (typeof acept !== 'boolean')
            return res.status(400).json(formatError('A boolean was expected'));

        const company = await Company.findById(id);
        if (!company)
            return res
                .status(404)
                .json(formatError(`No company found with id ${id}`));

    if (acept && company) {
      await sendConfirmationEmail(company)
    }
    else if (!acept && company) {
      await sendCompanyReject(company)
      await Company.findByIdAndDelete(id)
    }

        res.status(200).json('Email Send');
    } catch (error: any) {
        res.status(500).json(formatError(error));
    }
};

export const deleteMultiple: RequestHandler = async (req, res) => {
    try {
        const { ids } = req.body;
    
        ids.map(async (e: string) => {
           let  searchId = await Student.findById(e);
            if (!searchId) {
                searchId = await Company.findById(e);
            }
            if (!searchId) {
                searchId = await Admin.findById(e);
            }
            if (!searchId) {
                searchId = await Project.findById(e);
            }

            searchId.state = !searchId.state;
           searchId =  await searchId.save();

        })
        
        
        res.status(200).json("Cambio de estado exitoso");

    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};



export const setReclutamiento: RequestHandler = async (req, res) => {
    try {
        const { ids } = req.body;
        ids.map(async (e: string) => {

            let searchId = await Project.findById(e);
            searchId.stateOfProject === 'En revision'
                ? (searchId.stateOfProject = 'Reclutamiento')
                : '';
            await searchId.save();
            console.log(searchId);
        })
        res.status(200).json("Proyecto pasado a reclutamiento");
    } catch (error: any) {
        res.status(404).json(formatError(error.message));
    }
};