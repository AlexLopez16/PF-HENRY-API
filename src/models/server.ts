import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
import {verifyToken} from '../middlewares/authValidator'



const server = express();

//Body Parser
server.use(express.json())

//Morgan
server.use(morgan('dev'))



//Routes Paths
const paths = {
    user: '/api/user',
    auth: '/api/auth',
    projects:'/api/projects'
}

//Routes
server.use(paths.user, require('../routes/alumno'))
server.use(paths.auth,require('../routes/auth'))
server.use(paths.projects,verifyToken,require('../routes/projects'))
//DB Connection
connDB()

module.exports = server;