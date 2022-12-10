import { Router } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validator";
import {
  addStudentToProject,
  createProject,
  getProject,
  getProjects,
  deleteProject,
} from "../controllers/project";

import { rulesCreateProject,rulesGetProjects } from "../helper/rulesProjects";
const router = Router();

router.get("/",getProjects);
router.get("/:id", getProject);
router.post("/", rulesCreateProject, createProject);
router.put("/:id", addStudentToProject);
router.delete("/:id", deleteProject);

module.exports = router;
