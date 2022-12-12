const nodemailer = require('nodemailer');
import jwt from 'jsonwebtoken';
import { confirmEmail } from '../controllers/email';
require('dotenv').config();
const {
    HOST_EMAIL,
    PORT_EMAIL,
    USER_EMAIL,
    PASS_EMAIL,
    FROM_EMAIL,
    URL,
    PORT,
} = process.env;

export const sendConfirmationEmail = async (user: any) => {
    try {
        let transport = nodemailer.createTransport({
            host: HOST_EMAIL,
            port: PORT_EMAIL,
            auth: {
                user: USER_EMAIL,
                pass: PASS_EMAIL,
            },
        });

        // Creamos la url con un jwt.
        const token = jwt.sign(
            {
                email: user.email,
                rol: user.rol,
            },
            process.env.TOKEN_SECRET as string,
            { expiresIn: '24h' }
        );
        const urlConfirm = `${URL}:${PORT}/account/confirm/${token}`;

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

