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
];

export const rulesUsersCompany = [verifyToken, companyRole];