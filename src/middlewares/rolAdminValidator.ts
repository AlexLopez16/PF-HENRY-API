import { RequestHandler } from 'express';

// Este declare nos permite crear nuestras porpias requests y hacer el destructuring.

declare global {
    namespace Express {
        interface Request {
            user: any; //or can be anythin
        }
    }
}

// Verificamos el rol del usuario.

export const AdminRole: RequestHandler = async (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            error: 'Check token first',
        });
    }

    const { name, rol } = req.user;
    if (rol != 'ADMIN_ROL') {
        return res.status(401).json({
            error: `Unauthorized - ${name} has invalid role`,
        });
    }
    next();
};