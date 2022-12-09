import { validationResult, ValidationError } from 'express-validator';
import { RequestHandler } from 'express';
require('dotenv').config();

export const validate: RequestHandler = (req, res, next) => {
    const errorFormatter = ({ msg }: ValidationError) => {
        return { msg: `${msg}` };
    };

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        // Verificar despues: { onlyFirstError: true }
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
