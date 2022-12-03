import { Router } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validator";
import { loginUser } from "../controllers/auth";

const router = Router();

router.post(
  "/",
  [
    check("email", "Invalid email").isEmail(),
    check("email", "email is Required").not().isEmpty(),
    check("password", "password is Required").not().isEmpty(),
    validate,
  ],
  loginUser
);

module.exports = router;
