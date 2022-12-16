import e, { RequestHandler } from 'express';
const Student = require('../models/student');
const Company = require('../models/company');
import jwt, { JwtPayload } from 'jsonwebtoken';
import {verifyJwt} from '../helper/verifyJwt'
import { formatError } from '../utils/formatErros';
require('dotenv').config();
// Creamos el estudiante de la db y hasheamos el password.
export const confirmEmail: RequestHandler = async (req, res) => {
    try {
        const { token } = req.params;
        console.log(token)
        const {email,rol}=verifyJwt(token)
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
            company.verifid = true;
            await company.save();
            //return res.sendStatus(200);
        }

        return res.redirect('http://localhost:5173/dashboard/student');
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};
