import { RequestHandler } from 'express';
import { formatError } from '../utils/formatErros';
const Review = require('../models/review');
const Project = require('../models/project');

interface InitialBody {
  description: string;
  rating: number;
}

export const getReview: RequestHandler = async (req, res) => {
  try {


    const { id } = req.params;
    let findReview = await Review.findById(id)
      .populate({
        path: 'student',
        select: 'name lastName',
      })
      .populate({
        path: 'project',
        select: 'name',
      });

    res.status(200).send(findReview);
  } catch (error) {
    console.log(error);
  }
};

export const createReview: RequestHandler = async (req, res) => {
  try {
    const { description, rating }: InitialBody = req.body;
    const { _id } = req.user;

    const verifyStudent = await Project.find({ state: true, students: _id });

    if (!verifyStudent.length)
      throw new Error('No se encuentra registrado en el proyecto');

    const idProject = verifyStudent[0]._id;
    if (!rating) throw new Error('Debe ingresar un puntaje');

    let review = new Review({
      description,
      rating,
      student: _id,
      project: idProject,
    });

    await review.save();

    res.status(201).json({
      data: 'registered review',
    });
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }
};

export const editReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, rating }: InitialBody = req.body;
  
    const review = await Review.findByIdAndUpdate(id, { description, rating });
    await review.save();
  
    res.status(200).json('Rview actualizada');
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }
}

export const deleteReview: RequestHandler = async (req, res) => {

  try {
    const { id } = req.params;
    const review = await Review.deleteOne({_id: id})

    res.status(200).send('Review borrado con exito')
    
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }

}