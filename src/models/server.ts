import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
import { cors } from '../middlewares/cors';

const server = express();

//Body Parser
server.use('/api/checkout/webhook', express.raw({type: "*/*"}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }));

//Morgan
server.use(morgan('dev'));
//conexion con front
server.use(cors);

//Routes Paths
const paths = {
    student: '/api/student',
    company: '/api/company',
    auth:    '/api/auth',
    email:   '/account/confirm',
    project: '/api/project',
    checkout: '/api/checkout',

    admin: '/api/admin',


    password:'/recover/password'

};

//Routes
server.use(paths.student, require('../routes/student'));
server.use(paths.company, require('../routes/company'));
server.use(paths.auth, require('../routes/auth'));
server.use(paths.email, require('../routes/email'));
server.use(paths.project, require('../routes/project'));

server.use(paths.admin, require('../routes/admin'));


server.use(paths.password, require('../routes/password'));


server.use(paths.checkout, require('../routes/checkout'));

//DB Connection
connDB();

module.exports = server;
