import { check, ValidationError } from 'express-validator';
import { validate } from '../middlewares/validator';
import { validateStudentEmail, validateStudentRol } from './dbStudentValidator';
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


export const rulesGetStudents = [
    verifyToken,
    /*
    Nota para el proximo sprint:
    Aca tambien tiene que ir el validador, de que el que rol de los que piden la lista de estudiantes, sea company o admin, ya que no tiene sentido que un estudiante vea la lista de todos los estudiantes.
    */
];

export const rulesGetStudent = [verifyToken, studentRole];
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

export const rulesFilterStudentByName = [verifyToken];
export const rulesFilterTecnologies = [verifyToken];
export const rulesDeleteStudent = [verifyToken];

// export const rulesStudent = [verifyToken];