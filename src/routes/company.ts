import { Router } from 'express';
import {
    rulesCreateUserCompany,
    rulesUpdateUserCompany,
    rulesUsersCompany,
} from '../helpers/rulesCompany';
import { verifyToken } from '../middlewares/authValidator';
import {
    createUserCompany,
    deleteUserCompany,
    finalProject,
    getCompanyProject,
    getDetailCompany,
    getUserCompany,
    getUsersCompany,
    updateUserCompany,
} from './../controllers/company';

const router = Router();

router.get('/', rulesUsersCompany, getUsersCompany);

router.get('/login', rulesUsersCompany, getCompanyProject);

router.get('/:id', rulesUsersCompany, getUserCompany);

router.get('/detail/:id', verifyToken, getDetailCompany);

router.post('/', rulesCreateUserCompany, createUserCompany);

router.put('/final', finalProject);

router.put('/:id', rulesUpdateUserCompany, updateUserCompany);

router.delete('/:id', rulesUsersCompany, deleteUserCompany);

module.exports = router;
