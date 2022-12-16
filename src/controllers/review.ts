import { RequestHandler } from 'express';
import { ResultWithContext } from 'express-validator/src/chain';
import { formatError } from '../utils/formatErros';
const Review = require('../models/review');

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
                        select: 'name lastName'
                    }).populate({
                      path: 'project',
                      select: 'name'
                    });
    res.status(200).send(findReview);
  } catch (error) {
    console.log(error);
  }
};

export const createReview: RequestHandler = async (req, res) => {
  try {
    const { description, rating }: InitialBody = req.body;
    const { _id } = req.user

    if (!rating) throw new Error('Debe ingresar un puntaje');

    let review = new Review({
      description,
      rating,
      student: _id,
    });

    await review.save();

    res.status(201).json({
      data: 'registered review',
    });
  } catch (error: any) {
    res.status(500).json(formatError(error.message));
  }
};
