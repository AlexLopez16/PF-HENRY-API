import { check } from 'express-validator';
import { validate } from '../middlewares/validator';
import { verifyToken } from '../middlewares/authValidator';
import { studentRole } from '../middlewares/rolStudentValidator';
import { validateStudentRol } from './dbStudentValidator';


export const rulesCreateProject =[ check("name", "Name is required").not().isEmpty(),
check("description", "Description is require").not().isEmpty(),
check("participants", "Participants is required").not().isEmpty(),
check("requirements", "Requirements is required").not().isEmpty(),validate,]

export const rulesGetProjects = [
    check('rol').custom(validateStudentRol),
    validate,
    studentRole
  ];