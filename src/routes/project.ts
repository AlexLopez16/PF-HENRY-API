import { Router } from 'express';
import {
    addStudentToProject,
    createProject,
    getProject,
    getProjects,
    deleteProject,
    editProject,
    getCategory,
    addStudentToAccepts,
    removeStudentToAccepts,
    unApplyStudent,
} from '../controllers/project';

import { rulesCreateProject, rulesProject } from '../helpers/rulesProjects';
import { verifyToken } from '../middlewares/authValidator';
const router = Router();

router.get('/', verifyToken, getProjects);
router.get('/category', verifyToken, getCategory);
router.get('/:id', verifyToken, getProject);

router.post('/', rulesCreateProject, createProject);
router.put('/:id', verifyToken, addStudentToProject); //agregar validator rol-student
router.put('/edit/:id', rulesProject, editProject);
router.put('/accept/:id', addStudentToAccepts);
router.put('/denied/:id', removeStudentToAccepts);
router.put('/unapply/:id', unApplyStudent);

router.delete('/:id', rulesProject, deleteProject);

module.exports = router;
