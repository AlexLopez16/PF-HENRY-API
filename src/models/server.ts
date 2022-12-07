import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
import { verifyToken } from '../middlewares/authValidator';

const server = express();

//Body Parser
server.use(express.json());

//Morgan
server.use(morgan('dev'));

server.use(verifyToken);

//Routes Paths
const paths = {
    student: '/api/student',
    company: '/api/company',
    auth: '/api/auth',
    projects: '/api/project',
};

//Routes
server.use(paths.student, require('../routes/student'));
server.use(paths.company, require('../routes/company'));
server.use(paths.auth, require('../routes/auth'));
server.use(paths.projects, require('../routes/project'));
//DB Connection
connDB();

module.exports = server;
