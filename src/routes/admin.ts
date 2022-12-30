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
import { createAdmin, deleteAdmin, getAdmin, getAdminById, updateAdmin } from '../controllers/admin';

import { rulesAdmin } from '../helpers/rulesAdmin';
 
 const router = Router();
 //url/api/admin
 router.post('/', createAdmin);
 
 router.get('/getAdmin', rulesAdmin, getAdmin);
 router.get('/admin/:id', rulesAdmin, getAdminById);//funciona
 router.put('/:id', rulesAdmin, updateAdmin);       //funciona
 router.delete('/:id',rulesAdmin, deleteAdmin);     //funciona


 router.get('/getstudent', rulesAdmin, getStudents);
 router.get('/getcompany', rulesAdmin, getUsersCompany);
 router.get('/getproject', rulesAdmin, getProjects);

 router.get('/student/:id', rulesAdmin, getStudent);
 router.get('/company/:id', rulesAdmin, getUserCompany);
 router.get('/project/:id', rulesAdmin, getProject);
 
 router.put('/putstudent/:id', rulesAdmin, updateStudent);
 router.put('/putcompany/:id', rulesAdmin, updateUserCompany);
 router.put('/putproject/:id', rulesAdmin, addStudentToProject);
 
 router.delete('/student/:id', rulesAdmin, deleteStudent);
 router.delete('/company/:id', rulesAdmin, deleteUserCompany);
 router.delete("/project/:id", rulesAdmin, deleteProject);
 
 module.exports = router;
 