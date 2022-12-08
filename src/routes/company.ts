import { Router } from 'express';
import {
  rulesCreateUserCompany,
  rulesUpdateUserCompany,
  rulesDeleteUsersCompany,
  rulesGetUsersCompany,
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

router.get('/', rulesGetUsersCompany, getUsersCompany);

router.get('/:id', rulesGetUserCompany, getUserCompany);

router.post('/', rulesCreateUserCompany, createUserCompany);

router.put('/:id', rulesUpdateUserCompany, updateUserCompany);

router.delete('/:id', rulesDeleteUsersCompany, deleteUserCompany);

module.exports = router;
