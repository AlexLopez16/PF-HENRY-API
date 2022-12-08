import { Router } from 'express';
import { rulesCreateStudent, rulesGetStudent } from '../helpers/rulesStudent';
import {
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/student';
const router = Router();

router.post('/', rulesCreateStudent, createStudent);

router.get('/:id', rulesGetStudent, getStudent);

router.put('/:id', updateStudent);

router.delete('/:id', deleteStudent);

module.exports = router;
