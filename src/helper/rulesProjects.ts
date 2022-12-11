import { check } from 'express-validator';
import { validate } from '../middlewares/validator';
import { companyRole } from '../middlewares/rolCompanyValidator';



export const rulesCreateProject =[ check("name", "Name is required").not().isEmpty(),
check("description", "Description is require").not().isEmpty(),
check("participants", "Participants is required").not().isEmpty(),
check("requirements", "Requirements is required").not().isEmpty(),validate,companyRole]

export const ruleseEditProjects = [
    validate,
    companyRole
  ];

  export const rulesDeleteProject=[
    validate,
    companyRole
  ];
