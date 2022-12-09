import { check } from 'express-validator';
import { verifyToken } from '../middlewares/authValidator';
import { validate } from '../middlewares/validator';
import { validateCompanyRol } from './dbCompanyValidator';
import { companyRole } from '../middlewares/rolCompanyValidator';

export const rulesCreateUserCompany = [
  check('name', 'Name is required').not().isEmpty(),
  check('country', 'Country ir required').not().isEmpty(),
  check('email').custom(validateCompanyRol),
  check('email', 'Email is required').not().isEmpty(),
  validate,
];

export const rulesUpdateUserCompany = [
  check('name', 'Name is required').not().isEmpty(),
  check('country', 'Country ir required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  validate,
];

export const rulesGetUserCompany = [
  verifyToken,
  check('rol').custom(validateCompanyRol),
  validate,
  companyRole,
];

export const rulesGetUsersCompany = [
  verifyToken,
  check('rol').custom(validateCompanyRol),
  validate,
  companyRole,
];

export const rulesDeleteUsersCompany = [
  verifyToken,
  check('rol').custom(validateCompanyRol),
  validate,
  companyRole,
];
