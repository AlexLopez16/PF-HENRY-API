import e, { RequestHandler } from 'express';
const Student = require('../models/student');
import { hash } from '../helper/hash';
import { formatError } from '../utils/formatErros';
import { jwtGenerator } from '../helper/jwt';
import { sendConfirmationEmail } from '../helper/sendConfirmationEmail';
require('dotenv').config();
// Creamos el estudiante de la db y hasheamos el password.
export const createStudent: RequestHandler = async (req, res) => {
    try {
        let { name, lastName, email, password } = req.body;
        let hashPassword = await hash(password);
        let user = new Student({
            name,
            lastName,
            email,
            password: hashPassword,
        });
        user = await user.save();
        // Aca llamamos a la funcion de confirmationEmail.
        sendConfirmationEmail(user);
        // console.log(info);
        let rol = user.rol;
        let verify = user.verify;
        let id = user._id;
        const token = jwtGenerator(user._id, user.name);
        res.status(201).json({
            data: 'Sucessful singup',
            token,
            id,
            rol,
            verify,
        });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Traemos un estudiante por el id.
export const getStudent: RequestHandler = async (req, res) => {
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
        } = await Student.findById(id)
            .populate({
                path: 'project',
                populate: {
                    path: 'students',
                    select: 'name lastName',
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
        });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Traemos todos los estudiantes de la db.
export const getStudents: RequestHandler = async (req, res) => {
    try {
        const { limit = 10, init = 0, name, tecnologies } = req.query;

        // Estado inicial de nuestro query.
        let query: any = { state: true };

        // Agegramos si quiere filtrar por nombre.
        if (name) query.name = { $regex: name, $options: 'i' };

        // Agregamos si quiere filtrar por tecnologias.
        if (tecnologies) {
            let tecnologiesList: any = tecnologies;
            tecnologiesList = tecnologiesList.split(',');
            query.tecnologies = { $all: tecnologiesList };
        }

        // Ignora estos campos al momento de generarnos una respuesta, es decir, no nos muestra esa info.

        const ignore: any = {
            password: false,
            state: false,
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

        res.status(200).json({ msg: 'Student update succesfully' });
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
