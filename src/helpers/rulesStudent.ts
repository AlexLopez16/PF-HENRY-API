import { check, ValidationError } from 'express-validator';
import { validate } from '../middlewares/validator';
import {
    validateStudentEmail,
    validateStudentRol,
    validateExistStudent,
} from './dbStudentValidator';
import { verifyToken } from '../middlewares/authValidator';
import { studentRole } from '../middlewares/rolStudentValidator';

export const rulesCreateStudent = [
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'The name is invalid')
        .escape()
        .matches(/^[A-Za-z ]+$/),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('lastName', 'The last name is invalid')
        .escape()
        .matches(/^[A-Za-z ]+$/),
    check('email').custom(validateStudentEmail),
    check('email', 'Valid email is required').isEmail(),
    validate,
];

export const rulesGetStudent = [
    verifyToken,
    // Verificar este error despues.
    /*
    NOTA: esto debe verificar el estudiante.
     */
    // validateExistStudent,
    // check('rol').custom(validateStudentRol),
    // validate,
    studentRole,
];

export const rulesFilterStudentByName = [verifyToken];

export const rulesFilterTecnologies = [verifyToken];

export const rulesUpdateStudent = [
    verifyToken,
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'The name is invalid')
        .escape()
        .matches(/^[A-Za-z ]+$/),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('lastName', 'The last name is invalid')
        .escape()
        .matches(/^[A-Za-z ]+$/),
    validate,
];

export const rulesDeleteStudent = [verifyToken];
