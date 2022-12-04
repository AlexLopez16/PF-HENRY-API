import { Router } from "express";
// import { check } from "express-validator";
// import { validate } from "../middlewares/validator";
import { getProjects } from "./../controllers/projects";
const router = Router();

router.get("/", getProjects);

module.exports = router;
