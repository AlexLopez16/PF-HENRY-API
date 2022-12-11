/**
 * By: Sciangula Hugo.
 * Nota: El flujo es, ruta -> middelware (reglas) -> controller
 * Example: router.post('/', rulesCreateStudent, createStudent);
 */
import { Router } from 'express';

import {
    rulesCreateStudent,
    rulesFilterStudentByName,
    rulesGetStudent,
    rulesFilterTecnologies,
    rulesUpdateStudent,
    rulesDeleteStudent,
} from '../helper/rulesStudent';

import {
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    filterByName,
    filterByTecnologies,
} from '../controllers/student';

const router = Router();

router.post('/', rulesCreateStudent, createStudent);

router.get('/', rulesFilterStudentByName, filterByName);

router.get('/tecnologies', rulesFilterTecnologies, filterByTecnologies);

router.get('/:id', rulesGetStudent, getStudent);

router.put('/:id', rulesUpdateStudent, updateStudent);

router.delete('/:id', rulesDeleteStudent, deleteStudent);

module.exports = router;
