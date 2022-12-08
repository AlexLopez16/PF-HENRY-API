import { Router } from 'express';
import { check } from 'express-validator';
import { validate } from '../middlewares/validator';
import {
  addStudentToProject,
  createProject,
  getProject,
  getProjects,
  deleteProject,
} from '../controllers/project';
const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is require').not().isEmpty(),
  ],
  createProject,
);
router.put('/', addStudentToProject);
router.delete('/', deleteProject);

module.exports = router;
