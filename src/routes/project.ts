import { Router } from 'express';
// import { check } from "express-validator";
// import { validate } from "../middlewares/validator";
import { addStudentToProject, createProject } from '../controllers/project';
const router = Router();

router.post('/', createProject);
router.put('/', addStudentToProject);

module.exports = router;
