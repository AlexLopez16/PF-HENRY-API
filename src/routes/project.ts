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
  DeleteAccepts,
  UnapplyStudent,
  getAllProjects,

} from "../controllers/project";

import {
  rulesCreateProject,
  rulesProject,
} from "../helpers/rulesProjects";
import { verifyToken } from "../middlewares/authValidator";
const router = Router();

router.get("/all",verifyToken, getAllProjects)//trues and falses
router.get("/", verifyToken, getProjects);//only true 
router.get("/category", verifyToken,getCategory);
router.get("/:id", verifyToken, getProject);


router.post("/", rulesCreateProject, createProject);
router.put("/:id", verifyToken, addStudentToProject);//agregar validator rol-student
router.put("/edit/:id", rulesProject, editProject);
router.put('/accept/:id',acceptStudentToProject)
router.put("/denied/:id",DeleteAccepts)
router.put('/unapply/:id',UnapplyStudent)

router.delete("/:id", rulesProject, deleteProject);


module.exports = router;
