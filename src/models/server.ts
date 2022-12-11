import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
import { verifyToken } from '../middlewares/authValidator';
import {cors} from '../middlewares/cors'

const server = express();

//Body Parser
server.use(express.json());

//Morgan
server.use(morgan('dev'));
//conexion con front
server.use(cors)
//validacion del token
//Validacion de tokens
server.use(verifyToken);

/*
  By Hugo.
  Nota: los roles se verifican antes de continuar a la ruta con el siguiente middelware.  
*/
// import { verifyRol } from '../middlewares/rolValidator';
// server.use(verifyRol);



//Routes Paths
const paths = {
    student: '/api/student',
    company: '/api/company',
    auth:    '/api/auth',
    project: '/api/project',
    invoice: '/api/invoice',
};

//Routes
server.use(paths.student, require('../routes/student'));
server.use(paths.company, require('../routes/company'));
server.use(paths.auth,    require('../routes/auth'));
server.use(paths.invoice, require('../routes/invoice'));
server.use(paths.project, require('../routes/project'));
//DB Connection
connDB();

module.exports = server;
