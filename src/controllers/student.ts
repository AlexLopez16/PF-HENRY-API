import { RequestHandler } from 'express';
const User = require('../models/student');
import { hash } from '../helper/hash';
import { formatError } from '../utils/formatErros';

// Creamos el estudiante de la db y hasheamos el password.
export const createStudent: RequestHandler = async (req, res) => {
    try {
        let { name, lastName, email, password } = req.body;
        let hashPassword = await hash(password);
        const user = new User({
            name,
            lastName,
            email,
            password: hashPassword,
        });
        await user.save();
        res.status(201).json({
            user,
        });
    } catch (error) {
        res.status(500).json(formatError('Internal Server Error'));
    }
};

// Traemos un estudiante por el id.
export const getStudent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, _id, email } = await User.findById(id);

        res.status(200).json({
            id: _id,
            name,
            email,
        });
    } catch (error) {
        res.status(500).json(formatError('Internal Server Error'));
    }
};

// Traemos todos los estudiantes de la db.
export const getStudents: RequestHandler = async (req, res) => {
    try {
        const { limit = 5, init = 0 } = req.query;
        const query = { state: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(init).limit(limit),
        ]);

        res.status(200).json({
            total,
            users,
        });
    } catch (error) {
        res.status(500).json(formatError('Internal Server Error'));
    }
};

// Permitimos actualizar todos los atributos del estudiante.
export const updateStudent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const {
        email,
        state,
        gmail,
        github,
        slack,
        premium,
        password,
        age,
        ...user
    } = req.body;

    if (password) {
        let hashPassword = await hash(password);
        user.password = hashPassword;
    }

    const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });

    res.status(200).json(userUpdated);
};

// Damos la opcion de borrar al estudiante.
export const deleteStudent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
        id,
        { state: false },
        { new: true }
    );

    res.status(200).json(user);
};