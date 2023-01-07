const nodemailer = require("nodemailer");
import { jwtGenerator } from "./jwt";
require("dotenv").config();
const { HOST_EMAIL, PORT_EMAIL, USER_EMAIL, PASS_EMAIL, FROM_EMAIL } =
  process.env;

const URL = process.env.URL_DEPLOY || "http://localhost:3001";

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
        const urlConfirm = `${URL}/api/account/confirm/${token}`;

    // send mail with defined transport object
    const sendEmail = await transport.sendMail({
      from: FROM_EMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Please, confirm your email", // Subject line
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
      subject: "Please,ingrese al link", // Subject line
      //text: 'Hello world', // plain text body
      html: `<p>ingrese al link: <a href="${urlmodifyPassword}">Recuperar contraseña</a></p>`, // html body
    });
    console.log(sendEmail);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const mailprojectCancel = async (
  compania: object | any,
  values: object | any,
  proyecto: object | any
) => {
  try {
    const sendEmail = await transport.sendMail({
      from: FROM_EMAIL, // sender address
      to: compania.email, // list of receivers
      subject: "Rechazo de su proyecto", // Subject line
      //text: 'Hello world', // plain text body
      html: `<div>
            <p>Su proyecto: 
            <p>Empresa: ${compania.name}</p>
            <p>Descripcion: ${proyecto.description} </p>
            <p>Participantes: ${proyecto.participants} </p>
            <p>Requerimientos: ${proyecto.requirements} </p>
            <p>Categoria: ${proyecto.category} </p> 
            <h2>${values.respuesta}</h2>
            </div>`, // html body
    });
    console.log(sendEmail);
  } catch (error: any) {
    console.log(error.message);
  }
};
export const sendMailRating = async (mail: string,image:string,name:string,idProject:string,projectName:string) => {
  try {
    const urlRating = `http://127.0.0.1:5173/rating?project=${idProject}&student=${name}&image=${image}&projectName=${projectName}`; // falta redirijir
    // // send mail with defined transport object
    let sendEmail: any = await transport.sendMail({
      from: FROM_EMAIL, // sender address
      to: mail, // list of receivers
      subject: "deje su comenario sobre el proyecto",
      //text: 'Hello world', // plain text body
      html: `<p>ingrese a este link: <a href="${urlRating}"> deje su comenterio</a></p>`, // html body
    });
  } catch (error: any) {
    console.log(error.message);
  }
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