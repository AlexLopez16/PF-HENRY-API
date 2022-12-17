import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
import { cors } from '../middlewares/cors';

const server = express();

//Body Parser
server.use(express.json());

//Morgan
server.use(morgan('dev'));
//conexion con front
server.use(cors);

//Routes Paths
const paths = {
    student: '/api/student',
    company: '/api/company',
    auth: '/api/auth',
    email: '/account/confirm',
    project: '/api/project',
    invoice: '/api/invoice',
    admin: '/api/admin',

};

//Routes
server.use(paths.student, require('../routes/student'));
server.use(paths.company, require('../routes/company'));
server.use(paths.auth, require('../routes/auth'));
server.use(paths.email, require('../routes/email'));
server.use(paths.invoice, require('../routes/invoice'));
server.use(paths.project, require('../routes/project'));
server.use(paths.admin, require('../routes/admin'));


//DB Connection
connDB();

module.exports = server;
