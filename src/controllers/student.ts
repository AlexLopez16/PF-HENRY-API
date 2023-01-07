import { RequestHandler } from 'express';
const Student = require('../models/student');
import { hash } from '../helpers/hash';
import { formatError } from '../utils/formatErros';
import { jwtGenerator } from '../helpers/jwt';
import { sendConfirmationEmail } from '../helpers/sendConfirmationEmail';
require('dotenv').config();

interface InitialIgnore {
    password: boolean;
    state: boolean;
    gmail: boolean;
    github: boolean;
    rol: boolean;
}

// Creamos el estudiante de la db y hasheamos el password.
export const createStudent: RequestHandler = async (req, res) => {
    try {
        let { name, lastName, email, password } = req.body;
        let emailSearch = await Student.find({ email });
        if (emailSearch.length) {
            throw new Error('Email already in database');
        }
        let hashPassword = await hash(password);
        let user = new Student({
            name,
            lastName,
            email,
            password: hashPassword,
            admission: Date.now(),
        });
        user = await user.save();
        // Aca llamamos a la funcion de confirmationEmail.
        sendConfirmationEmail(user);
        // Solucionado los problemas.
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

// Traemos un estudiante por el id.
export const getStudent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if ((<any>req).user.rol !== 'ADMIN_ROL' && (<any>req).user.id !== id) {
            return res.status(401).json(formatError('Access denied'));
        }
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
            working,
            admission,
        } = await Student.findById(id)
            .populate({
                path: 'working',
                select: '-students',
                populate: {
                    path: 'accepts',
                    select: 'name lastName image',
                },
            })
            .populate({
                path: 'working',
                populate: {
                    path: 'company',
                    select: 'name',
                },
            })
            .populate({
                path: 'project',
                populate: {
                    path: 'company',
                    select: 'name',
                },
            });
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
            working,
            admission,
        });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Traemos todos los estudiantes de la db.
export const getStudents: RequestHandler = async (req, res) => {
    try {
        const {
            limit = 6,
            init = 0,
            name,
            tecnologies,
            onlyActive = 'true',
        } = req.query;

        // Estado inicial de nuestro query.
        let query: any = {};

        if (onlyActive === 'true') {
            query.state = true;
        }

        // Agegramos si quiere filtrar por nombre.
        if (name) query.name = { $regex: name, $options: 'i' };

        // Agregamos si quiere filtrar por tecnologias.
        if (tecnologies) {
            let tecnologiesList: any = tecnologies;
            tecnologiesList = tecnologiesList.split(',');
            query.tecnologies = { $all: tecnologiesList };
        }

        // Ignora estos campos al momento de generarnos una respuesta, es decir, no nos muestra esa info.

        const ignore = {
            password: false,
            //state: false,
            gmail: false,
            github: false,
            rol: false,
        };

        const [total, students] = await Promise.all([
            Student.countDocuments(query),
            Student.find(query, ignore).skip(init).limit(limit).populate({
                path: 'project',
                select: 'name',
            }),
        ]);
        res.status(200).json({ total: total, students });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Permitimos actualizar todos los atributos del estudiante.
export const updateStudent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            email,
            state,
            gmail,
            github,
            slack,
            premium,
            password,
            age,
            ...student
        } = req.body;

        if (password) {
            let hashPassword = await hash(password);
            student.password = hashPassword;
        }

        await Student.findByIdAndUpdate(id, student, {
            new: true,
        });

        res.status(200).json(student);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Damos la opcion de borrar (cambiar su estatus a false) al estudiante.
export const deleteStudent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Student.findByIdAndUpdate(
            id,
            { state: false },
            { new: true }
        );

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};
