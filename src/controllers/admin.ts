import { RequestHandler } from 'express';
const Admin = require('../models/admin');
import { hash } from '../helper/hash';
import { jwtGenerator } from '../helper/jwt';
import { formatError } from '../utils/formatErros';

// CREATE
export const createAdmin: RequestHandler = async (req, res) => {
    try {
        let { name, lastName, email, password 
        } = req.body;
        let hashPassword = await hash(password);
        let user = new Admin({
            name,
            lastName,
            email,
            password: hashPassword,
        });
        await user.save();
    
        let rol = user.rol;
        let verify = user.verify;
        let id = user._id;
        let obj={id:user._id,name:user.name}
        const token = jwtGenerator(obj);
        res.status(201).json({
            data: 'Sucessful singup',
            token,
            id,
            rol,
            verify,
        });
    } catch (error: any) {
    
     
       
        res.status(500).json(formatError(error.message));
    }
};

export const getAdmin: RequestHandler = async (req, res) => {
    try {
        const { limit = 10, init = 0 } = req.query;
        const query = { state: true };
        const ignore: any = {
          password: false,
          state: false,
          gmail: false,
          github: false,
          rol: false,
        };
        const [total, admins] = await Promise.all([
         Admin.countDocuments(query),
          Admin.find(query, ignore).skip(init).limit(limit),
        ]);
        res.status(200).json({
          total,
         admins,
        });
      } catch (error: any) {
        res.status(500).send(formatError(error.message));
      }
    };
  
export const getAdminById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            lastName,
            _id,
            email,
            image,
            description,
            tecnologies,
            project,
            company,
            country,
        } = await Admin.findById(id)
        res.status(200).json({
            id: _id,
            name,
            lastName,
            country,
            image,
            description,
            email,
            tecnologies,
            project,
            company,
        });
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

export const updateAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            rol,
            email,
            password,   
            ...admin
        } = req.body;

        if (password) {
            let hashPassword = await hash(password);
            admin.password = hashPassword;
        }

        await Admin.findByIdAndUpdate(id, admin, {
            new: true,
        });

        res.status(200).json(admin);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

// Damos la opcion de borrar (cambiar su estatus a false) al admin.
export const deleteAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Admin.findByIdAndUpdate(
            id,
            { state: false },
            { new: true }
        );

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};