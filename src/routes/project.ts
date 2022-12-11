import { Router } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validator";
import {
  addStudentToProject,
  createProject,
  getProject,
  getProjects,
  deleteProject,
  editProject
} from "../controllers/project";

import { rulesCreateProject,ruleseEditProjects,rulesDeleteProject } from "../helper/rulesProjects";
const router = Router();

router.get("/",getProjects);
router.get("/:id", getProject);
router.post("/", rulesCreateProject, createProject);
router.put("/:id", addStudentToProject);
router.put('/edit/:id',ruleseEditProjects,editProject)
router.delete("/:id",rulesDeleteProject, deleteProject);

module.exports = router;
