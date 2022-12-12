/**
 * By: Sciangula Hugo.
 * Nota: El flujo es, ruta -> middelware (reglas) -> controller
 * Example: router.post('/', rulesCreateStudent, createStudent);
 */
import { Router } from 'express';

import {
    rulesCreateStudent,
    rulesGetStudent,
    rulesUpdateStudent,
    rulesDeleteStudent,
} from '../helper/rulesStudent';

import {
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    getStudents,
} from '../controllers/student';

const router = Router();

router.post('/', rulesCreateStudent, createStudent);

router.get('/', getStudents);

router.get('/:id', rulesGetStudent, getStudent);

router.put('/:id', updateStudent);

router.delete('/:id', rulesDeleteStudent, deleteStudent);

module.exports = router;
