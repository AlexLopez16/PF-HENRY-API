import { check } from "express-validator";
import { validate } from "../middlewares/validator";
import { companyRole } from "../middlewares/rolCompanyValidator";
import { verifyToken } from "../middlewares/authValidator";

export const rulesCreateProject = [
  verifyToken,
  check("name", "Name is required").not().isEmpty(),
  check("description", "Description is require").not().isEmpty(),
  check("participants", "Participants is required").not().isEmpty(),
  check("requirements", "Requirements is required").not().isEmpty(),
  validate,
  companyRole,
];

export const ruleseEditProjects = [verifyToken, validate, companyRole];

export const rulesDeleteProject = [verifyToken, validate, companyRole];
