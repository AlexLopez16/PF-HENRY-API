import { Router } from 'express';
import { check } from 'express-validator';
import { validate } from '../middlewares/validator';
import {
  createUserCompany,
  deleteUserCompany,
  getUserCompany,
  getUsersCompany,
  updateUserCompany,
} from './../controllers/company';
const router = Router();

router.get('/', getUsersCompany);

router.get('/:id', getUserCompany);

router.post(
  '/',
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validate,
  ],
  createUserCompany,
);

router.put('/:id', updateUserCompany);
router.delete('/:id', deleteUserCompany);

module.exports = router;
