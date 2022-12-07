import { Router } from 'express';
// import { check } from "express-validator";
// import { validate } from "../middlewares/validator";
import { addStudentToProject, createProject, getProject } from '../controllers/project';
const router = Router();

router.get('/', getProject);
router.post('/', createProject);
router.put('/', addStudentToProject);

module.exports = router;
