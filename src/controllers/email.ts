import e, { RequestHandler } from 'express';
const Student = require('../models/student');
const Company = require('../models/company');
const Admin = require('../models/admin');
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../helpers/verifyJwt';
import { formatError } from '../utils/formatErros';
import { sendConfirmationEmail } from '../helpers/sendConfirmationEmail';
require('dotenv').config();
// Creamos el estudiante de la db y hasheamos el password.
export const confirmEmail: RequestHandler = async (req, res) => {
    try {
        const { token } = req.params;
        const { email, rol } = verifyJwt(token);
        // Si es estudiante, actualizamos el verify en student.
        if (rol === 'STUDENT_ROL') {
            let student = await Student.findOne({ email: email });
            if (!student) throw new Error('Student not found');
            if (student.verify) throw new Error('Student already verifid');
            student.verify = true;
            await student.save();
            //return res.sendStatus(200);
        }
        // Si es company, actualizamos el verify en company.
        if (rol === 'COMPANY_ROL') {
            let company = await Company.findOne({ email: email });
            if (!company) throw new Error('Company not found');
            if (company.verify) throw new Error('Company already verifid');
            company.verify = true;
            await company.save();
            //return res.sendStatus(200);
        }

        return res.redirect(
            `${process.env.URL_FRONT || 'http://localhost:5173'}/projects`
        );
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

/**
 * By Sciangula Hugo.
 * NOTA: Aca vamos a reenviar el email de usuario.
 */
export const reSendEmail: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const token = req.header('user-token');
        // Una vez que tenemos el token y el email, verificamos si no confirmo su correo.
        let { id } = verifyJwt(token);
        let admin = await Admin.findOne({ email });
        if (admin) throw new Error('Email already use');
        let student = await Student.findOne({ id, verify: 'false' });
        let user = student;
        if (!student) {
            let company = await Company.findOne({ id, verify: 'false' });
            user = company;
            if (!company) throw new Error('User not found');
        }
        // Si encontramos estudiante, ahora verificamos si cambio el correo o no.
        if (user.email == email) {
            // Si no cambio el correo, solo reenviamos el correo.
            let response = await sendConfirmationEmail(user);
            console.log(response);
        } else {
            // Si no es el mismo correo, es decir, que lo modifico, entonces lo buscamos primero.
            student = await Student.findOne({ email });
            // Si encontramos a un estudiante con ese correo, error.
            if (student) throw new Error('Email already use');
            else if (!student) {
                let company = await Company.findOne({ email });
                // Si encontramos a otro estudiante con ese correo, error.
                if (company) throw new Error('Email already use');
                // Si no encontramos usuario ni compania que ocupen ese nuevo correo, entonces se lo asignamos al usuario.
                if (user.rol === 'STUDENT_ROL') {
                    await Student.findByIdAndUpdate(
                        id,
                        { email },
                        { new: true }
                    );
                } else if (user.rol === 'COMPANY_ROL') {
                    await Company.findByIdAndUpdate(
                        id,
                        { email },
                        { new: true }
                    );
                }

                let response = await sendConfirmationEmail(user);
                console.log(response);
            }
        }

        res.status(200).json({ msg: 'Update successfully' });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};
