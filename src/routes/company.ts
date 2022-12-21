import { Router } from 'express';
import {
  rulesCreateUserCompany,
  rulesUpdateUserCompany,
  rulesUsersCompany,
} from '../helpers/rulesCompany';
import {
    createUserCompany,
    deleteUserCompany,
    getCompanyProject,
    getUserCompany,
    getUsersCompany,
    updateUserCompany,
} from './../controllers/company';

const router = Router();

router.get('/', rulesUsersCompany, getUsersCompany);

router.get('/:id', rulesUsersCompany, getUserCompany);

router.get("/login/:id",rulesUsersCompany,getCompanyProject);

router.post('/', rulesCreateUserCompany, createUserCompany);

router.put('/:id', rulesUpdateUserCompany, updateUserCompany);

router.delete('/:id', rulesUsersCompany, deleteUserCompany);

module.exports = router;
