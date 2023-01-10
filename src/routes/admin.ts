/**
 * By: Sciangula Hugo.
 * Nota: El flujo es, ruta -> middelware (reglas) -> controller
 * Example: router.post('/', rulesCreateStudent, createStudent);
 */
import { Router } from 'express';
import {

    getStudent,
    updateStudent,
    deleteStudent,
    getStudents,
} from '../controllers/student';


import { deleteUserCompany, getUserCompany, getUsersCompany, updateUserCompany } from '../controllers/company';
import { addStudentToProject, deleteProject, getProject, getProjects } from '../controllers/project';
import { AprovedProject, createAdmin, deleteAdmin,  deleteMultiple,  deniedProject, getAdmin, getAdminById, getChart, getCompanies, sendEmailCompanyforProjectDenied, setReclutamiento, updateAdmin, verifyCompany } from '../controllers/admin';

import { rulesAdmin } from '../helpers/rulesAdmin';
import { deleteReview, getReviews } from '../controllers/review';

const router = Router();
//url/api/admin
router.post('/', createAdmin);

router.get('/getAdmin', rulesAdmin, getAdmin);
router.get('/admin/:id', rulesAdmin, getAdminById);//funciona
router.put('/edit/:id', rulesAdmin, updateAdmin); //funciona

router.get('/charts', getChart)

router.get('/getstudent', rulesAdmin, getStudents);
router.get('/getcompany', rulesAdmin, getUsersCompany);
router.get('/getproject', rulesAdmin, getProjects);

router.get('/student/:id', rulesAdmin, getStudent);
router.get('/company/:id', rulesAdmin, getUserCompany);
router.get('/project/:id', rulesAdmin, getProject);
router.get('/getreviews',rulesAdmin,getReviews)


router.put('/deletereviews', rulesAdmin, deleteReview);
router.put('/stateuser', deleteAdmin);//no poner regla POR QUE la comparte con otro user
router.put('/aprovedproject', rulesAdmin, AprovedProject);
router.put('/putstudent/:id', rulesAdmin, updateStudent);
router.put('/putcompany/:id', rulesAdmin, updateUserCompany);
router.put('/putproject/:id', rulesAdmin, addStudentToProject);
router.put('/deniedProjectadmin', rulesAdmin, deniedProject);
router.put('/setEnReclutamiento',setReclutamiento)
router.post('/eliminatedproject',rulesAdmin, sendEmailCompanyforProjectDenied);

router.put('/deletemultiple',deleteMultiple)//no poner regla POR QUE la comparte con otro user

// Rutas para verificar empresa
router.get('/getCompanies', rulesAdmin, getCompanies)
router.post('/verifyCompany', rulesAdmin, verifyCompany)



module.exports = router;