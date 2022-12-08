import { Router } from 'express';
import { check } from 'express-validator';
import { verifyToken } from '../middlewares/authValidator';
import { validate } from '../middlewares/validator';
import {
    rulesCreateUserCompany,
    rulesUpdateUserCompany,
    rulesDeleteUsersCompany,
    rulesGetUserCompany,
} from '../helper/rulesCompany';
import {
    createUserCompany,
    deleteUserCompany,
    getUserCompany,
    getUsersCompany,
    updateUserCompany,
} from './../controllers/company';

const router = Router();

// router.get('/', rulesGetUsersCompany, getUsersCompany);

router.get('/:id', rulesGetUserCompany, getUserCompany);

router.post('/', rulesCreateUserCompany, createUserCompany);

router.put('/:id', rulesUpdateUserCompany, updateUserCompany);

router.delete('/:id', rulesDeleteUsersCompany, deleteUserCompany);

module.exports = router;
