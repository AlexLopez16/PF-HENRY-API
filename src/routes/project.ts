import { Router } from "express";
import {
  addStudentToProject,
  createProject,
  getProject,
  getProjects,
  deleteProject,
  editProject,
  getCategory,

} from "../controllers/project";

import {
  rulesCreateProject,
  ruleseEditProjects,
  rulesDeleteProject,
} from "../helper/rulesProjects";
import { verifyToken } from "../middlewares/authValidator";
const router = Router();

router.get("/", verifyToken, getProjects);
router.get("/category", verifyToken,getCategory);
router.get("/:id", verifyToken, getProject);

router.post("/", rulesCreateProject, createProject);
router.put("/:id", verifyToken, addStudentToProject);
router.put("/edit/:id", ruleseEditProjects, editProject);
router.delete("/:id", rulesDeleteProject, deleteProject);

module.exports = router;
