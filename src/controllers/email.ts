import e, { RequestHandler } from 'express';
const Student = require('../models/student');
const Company = require('../models/company');
const Admin = require('../models/admin');
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../helpers/verifyJwt';
import { formatError } from '../utils/formatErros';
import { sendConfirmationEmail } from '../helpers/sendConfirmationEmail';
import { searchUserForVerify } from '../helpers/searchUser';
require('dotenv').config();
// Creamos el estudiante de la db y hasheamos el password.
export const confirmEmail: RequestHandler = async (req, res) => {
    try {
        const { token } = req.params;
        const { email, rol } = verifyJwt(token);
        // Si es estudiante, actualizamos el verify en student.
        if (rol === 'STUDENT_ROL') {
            let student = await Student.findOne({ email: email });
            if (!student) throw new Error('Estudiante no encontrado');
            if (student.verify) throw new Error('Estudiante ya verificado');
            student.verify = true;
            await student.save();
            //return res.sendStatus(200);
        }
        // Si es company, actualizamos el verify en company.
        if (rol === 'COMPANY_ROL') {
            let company = await Company.findOne({ email: email });
            if (!company) throw new Error('compañia no encontrada');
            if (company.verify) throw new Error('compañia ya verificada');
            company.verify = true;
            await company.save();
            //return res.sendStatus(200);
        }

        if(rol === 'ADMIN_ROL') {
            const admin = await Admin.findOne({ email: email });
            if(!admin)
                throw new Error('Administrador no encontrado');
            
            if(admin.verify)
                throw new Error('Administrador ya verificado');

            admin.verify = true;

            await admin.save();
        }

        return res.redirect(
            `${process.env.URL_FRONT || 'http://localhost:5173'}/login`
        );
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

/**
 * By Sciangula Hugo.
 * NOTA: Aca solo informamos si el email fue verificado o no.
 */

export const isVerify: RequestHandler = async (req, res) => {
    try {
        const { email } = req.params;
        // Buscamos en los student
        let user = await Student.findOne({ email, verify: true });
        console.log(user);
        if (!user) user = await Company.findOne({ email, verify: true });
        if (!user) user = await Admin.findOne({ email, verify: true });
        if (!user) throw new Error('Email no verificado.');

        res.status(200).json({ msg: 'Email verificado.' });
    } catch (error: object | any) {
        res.status(500).json(formatError(error.message));
    }
};

/**
 * By Sciangula Hugo.
 * Refactor by Alejandro Lopez :D.
 * NOTA: Aca vamos a reenviar el email de usuario.
 */
export const reSendEmail: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const token = req.header('user-token');
        // Una vez que tenemos el token y el email, verificamos si no confirmo su correo.
        let { id: _id } = verifyJwt(token);
        // Buscamos que es parsona con ese id, ya no tenga verificada su cuenta.
        let user = await Student.findOne({ verify: true, email });
        if (!user) user = await Company.findOne({ verify: true, email });
        if (!user) user = await Admin.findOne({ verify: true, email });
        if (user) throw new Error('Email ya verificado');
        // Si no hay nadie con ese correo confirmado empezamso con el student,
        let company: object | any = {};
        const student = await searchUserForVerify('Student', _id, email);
        if (!student) {
            company = await searchUserForVerify('Company', _id, email);
        } else if (!company) {
            await searchUserForVerify('Admin', _id, email);
        }
        res.status(200).json({ msg: 'Actualizado correctamente.' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json(formatError(error.message));
    }
};
