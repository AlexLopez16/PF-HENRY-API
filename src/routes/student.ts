import { Router } from 'express';
import { check } from 'express-validator';
import { validate } from '../middlewares/validator';
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/student';
const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.post(
    '/',
    [
        check('name', 'Name is Required').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        validate,
    ],
    createUser
);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
