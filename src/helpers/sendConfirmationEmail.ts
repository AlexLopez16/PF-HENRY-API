const nodemailer = require("nodemailer");
import path from "path";
require("dotenv").config();
const ejs = require('ejs')

import { jwtGenerator } from "./jwt";

const { HOST_EMAIL, PORT_EMAIL, USER_EMAIL, PASS_EMAIL, FROM_EMAIL } = process.env;

const URL = process.env.URL_DEPLOY || "http://localhost:3001";
const URL_FRONT = process.env.URL_FRONT || "http://localhost:5173"
const _path = path.join(__dirname, '..', 'emails')

const transport = nodemailer.createTransport({
    host: HOST_EMAIL,
    port: PORT_EMAIL,
    auth: {
        user: USER_EMAIL,
        pass: PASS_EMAIL,
    },
    tls: { rejectUnauthorized: false }, //arregla el error del mail
});

interface Props {
    name: string
    lastName: string,
    email: string,
    rol: string
}

export const sendConfirmationEmail = async (user: Props) => {
    const { name, lastName: last, email } = user;

    if (!last) name.trim()

    // try {
    let obj = { email: user.email, rol: user.rol };

    // Creamos la url con un jwt.
    const token = jwtGenerator(obj);
    const url = `${URL}/api/account/confirm/${token}`;

    ejs.renderFile(_path + '/Confirmation.ejs', { name, last, email, url }, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${email}`,
                    subject: "Por favor confirma tu email",
                    html: data
                })
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })
};

export const recuperatePassword = async (user: { email: string }) => {
    const { email } = user;

    // Creamos la url con un jwt.
    const token = jwtGenerator({ email });
    const urlmodifyPassword = `${URL}/api/recover/password/redirect/${token}`;

    ejs.renderFile(_path + '/RecuperatePassword.ejs', { url: urlmodifyPassword }, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${email}`,
                    subject: "Recupera tu contraseña",
                    html: data
                })
                console.log('Email Send')
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })
};

export const mailprojectCancel = async (compania: object | any, values: object | any, proyecto: object | any) => {

    const dataValues = {
        company: compania.name,
        description: proyecto.description,
        participants: proyecto.participants,
        requirements: proyecto.requirements,
        category: proyecto.category,
        message: values.respuesta,
        url: `${URL_FRONT}/login`
    }

    ejs.renderFile(_path + '/ProjectCancel.ejs', dataValues, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${compania.email}`,
                    subject: "Proyecto no aceptado",
                    html: data
                })
                console.log('Email Send')
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })
};

export const sendMailRating = async (mail: string, image: string, name: string, idProject: string, projectName: string, id: string) => {
    let obj = { email: mail, id: id };
    const token = jwtGenerator(obj);
    const urlRating = `${URL_FRONT}/rating?project=${idProject}&student=${name}&image=${image}&projectName=${projectName}&id=${id}&token=${token}`;

    ejs.renderFile(_path + '/CompanyEmail.ejs', { name, project: projectName, url: urlRating }, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${mail}`,
                    subject: "Projecto Terminado",
                    html: data
                })
                console.log('Email Send')
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })
};

export const contactEmail = async (data: any, name: string) => {
    try {
        await transport.sendMail({
            from: '"NABIJASH" nabijash@gmail.com',
            to: 'nabijash@gmail.com',
            subject: `${name} quiere ponerse en contacto`,
            html: data
        })
        return 'Email Send'
    } catch (error) {
        console.log(error)
        return 'Email fail to sent'
    }
}

export const emailForCompany = async (user: { email: string, name: string }) => {

    const { name, email } = user;

    ejs.renderFile(_path + '/CompanyEmail.ejs', { name }, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${email}`,
                    subject: "Solicitud Recibida",
                    html: data
                })
                console.log('Email Send')
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })

}

export const sendCompanyReject = async (user: { email: string, name: string }) => {
    const { name, email } = user

    ejs.renderFile(_path + '/CompanyReject.ejs', { name }, async (error: any, data: any) => {
        if (error) {
            console.log(error)
        }
        else {
            try {
                await transport.sendMail({
                    from: '"NABIJASH" nabijash@gmail.com',
                    to: `${email}`,
                    subject: "Solicitud Rechazada",
                    html: data
                })
                console.log('Email Send')
                return 'Email Send'
            } catch (error) {
                console.log(error)
                return 'Email fail to sent'
            }
        }
    })
}