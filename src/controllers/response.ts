import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
const Response = require('../models/response');
const Project = require('../models/project');

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
      
      const project = await Project.findById( projectId )
      if( !project ){
        throw new Error( "Proyecto no encontrado" )
      }

      let responses = [ res1, res2, res3];
      console.log(responses);
      

      let response = new Response({
        response: responses,
        studentId: _id,
        projectId,
      }) 
      await response.save();

      res.sendStatus(200)


    } catch (error: any) {
      res.status(500).json(formatError(error.message));
    }
  };