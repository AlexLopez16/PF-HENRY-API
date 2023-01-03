const nodemailer = require('nodemailer');
import { jwtGenerator } from './jwt';
require('dotenv').config();
const {
    HOST_EMAIL,
    PORT_EMAIL,
    USER_EMAIL,
    PASS_EMAIL,
    FROM_EMAIL,
} = process.env;

const URL = process.env.URL_DEPLOY || 'http://localhost:3001'

const transport = nodemailer.createTransport({
    host: HOST_EMAIL,
    port: PORT_EMAIL,
    auth: {
        user: USER_EMAIL,
        pass: PASS_EMAIL,
    },
    tls: { rejectUnauthorized: false }, //arregla el error del mail
});

export const sendConfirmationEmail = async (user: any) => {
    try {
        let obj = { email: user.email, rol: user.rol };

        // Creamos la url con un jwt.
        const token = jwtGenerator(obj);
        const urlConfirm = `${URL}/account/confirm/${token}`;

        // send mail with defined transport object
        const sendEmail = await transport.sendMail({
            from: FROM_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: 'Please, confirm your email', // Subject line
            //text: 'Hello world', // plain text body
            html: `<p>Confirm your email: <a href="${urlConfirm}">Confirm</a></p>`, // html body
        });
        console.log(sendEmail);
    } catch (error: any) {
        console.log(error.message);
    }
};
export const recuperatePassword = async (user: any) => {
    try {
        let obj = { email: user.email };

        // Creamos la url con un jwt.
        const token = jwtGenerator(obj);
        const urlmodifyPassword = `${URL}/api/recover/password/redirect/${token}`;
        // send mail with defined transport object
        const sendEmail = await transport.sendMail({
            from: FROM_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: 'Please,ingrese al link', // Subject line
            //text: 'Hello world', // plain text body
            html: `<p>ingrese al link: <a href="${urlmodifyPassword}">Recuperar contraseña</a></p>`, // html body
        });
        console.log(sendEmail);
    } catch (error: any) {
        console.log(error.message);
    }
};
