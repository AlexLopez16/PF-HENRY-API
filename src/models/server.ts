import express from 'express';
import morgan from 'morgan';
import { connDB } from '../database/config';
const server = express();

//Body Parser
server.use(express.json())

//Morgan
server.use(morgan('dev'))

//Routes Paths
const paths = {
    user: '/api/user',
}

//Routes
server.use(paths.user, require('../routes/alumno'))
// server.use(paths.form, require('.....form'))
// server.use(paths.auth, require('../controllers/auth'))

//DB Connection
connDB()

module.exports = server;