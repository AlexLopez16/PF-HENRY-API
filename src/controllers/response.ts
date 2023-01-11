import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
const Response = require('../models/response');
const Project = require('../models/project');
const Student = require('../models/student');

interface InitialBody {
    res1: string;
    res2: string
    res3: string
    projectId: string
  }

export const createResponse: RequestHandler = async (req, res) => {
    try {

      const { res1, res2, res3, projectId}: InitialBody = req.body;
      const { _id } = req.user;

      console.log(projectId)
      
      const project = await Project.findById( projectId )
      if( !project ){
        throw new Error( "Proyecto no encontrado" )
      }

      let responses = [ res1, res2, res3];

      let response = new Response({
        response: responses,
        studentId: _id,
        projectId,
      }) 
      await response.save();

      //Guardamso el id de la response en el estudiante.
      let student = await Student.findById(_id);
      student.responses = [...student.responses, response._id];
      await student.save();
  
      // Guardamos el id de la respuesta en el proyecto.
      const projectResponses = await Project.findById( projectId )
      projectResponses.responses = [...projectResponses.responses, response._id];
      await projectResponses.save();

      res.status(200).json({msg: 'Respuesta guardada.'})
    } catch (error: any) {
      res.status(500).json(formatError(error.message));
    }
  };