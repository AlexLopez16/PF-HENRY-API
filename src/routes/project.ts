import { Router } from "express";
import {
  addStudentToProject,
  createProject,
  getProject,
  getProjects,
  deleteProject,
  editProject,
  getCategory,
  acceptStudentToProject,
  FromAcceptoToStudent,

} from "../controllers/project";

import {
  rulesCreateProject,
  rulesProject,
} from "../helper/rulesProjects";
import { verifyToken } from "../middlewares/authValidator";
const router = Router();

router.get("/", verifyToken, getProjects);
router.get("/category", verifyToken,getCategory);
router.get("/:id", verifyToken, getProject);


router.post("/", rulesCreateProject, createProject);
router.put("/:id", verifyToken, addStudentToProject);
router.put("/edit/:id", rulesProject, editProject);
router.put('/accept/:id',rulesProject,acceptStudentToProject)
router.put( '/denied/:id',rulesProject,FromAcceptoToStudent)

router.delete("/:id", rulesProject, deleteProject);


module.exports = router;
