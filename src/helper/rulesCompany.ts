import { check } from 'express-validator';
import { verifyToken } from '../middlewares/authValidator';
import { validate } from '../middlewares/validator';
import { companyRole } from '../middlewares/rolCompanyValidator';

export const rulesCreateUserCompany = [
  check('name', 'Name is required').not().isEmpty(),
  check('country', 'Country ir required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  validate,
];

export const rulesUpdateUserCompany = [
  verifyToken,
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'The name is invalid')
    .escape()
    .matches(/^[A-Za-z ]+$/),
  check('country', 'Country is required').not().isEmpty(),
  check('country', 'The country is invalid')
    .escape()
    .matches(/^[A-Za-z ]+$/),
  check('email', 'Email is required').not().isEmpty(),
  validate,
];

export const rulesGetUserCompany = [verifyToken, companyRole];

export const rulesGetUsersCompany = [verifyToken, companyRole];//consultar pòrq esta repetido,

export const rulesDeleteUsersCompany = [verifyToken, companyRole];
