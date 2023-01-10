import { RequestHandler } from 'express';
import { sendMailCancelRating } from '../helpers/sendConfirmationEmail';
import { formatError } from '../utils/formatErros';
const Review = require('../models/review');
const Project = require('../models/project');
const Student = require('../models/student');

interface InitialBody {
    description: string;
    ratingProject: number;
    ratingCompany: number;
    id: string;
    idProject: string;
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
        const {
            description,
            ratingProject,
            ratingCompany,
            id: student,
            idProject: project,
        }: InitialBody = req.body;

        if (!ratingProject) throw new Error('Debe ingresar un puntaje');

        let review = new Review({
            description,
            ratingProject,
            ratingCompany,
            student,
            project,
        });
        await review.save();

        // Guardamos el id de la review en el estudiante.
        let reviewAutor = await Student.findById(student);
        reviewAutor.review = review._id;
        await reviewAutor.save();

        // Guardamos el id de la review en el proyecto.
        let reviewProject = await Project.findById(project);
        reviewProject.reviews = [...reviewProject.reviews, review._id];
        await reviewProject.save();

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
        const { description, ratingProject, ratingCompany } = req.body;

        const filter = { _id: id };
        const update = { description, ratingProject, ratingCompany };

        const findReview = await Review.findOneAndUpdate(filter, update, {
            new: true,
        });
        await findReview.save();

        res.status(201).json(findReview);
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};

export const getReviews: RequestHandler = async (req, res) => {
    try {
        let getreviews = await Review.find({})
            .populate('student', 'name email')
            .populate({
                path: 'project',
                populate: {
                    path: 'company',
                    select: 'name ',
                },
            });
        res.status(200).send(getreviews);
    } catch (error) {
        console.log(error);
    }
};

export const deleteReview: RequestHandler = async (req, res) => {
    try {
        const { idrev, values } = req.body;
        let review = await Review.findById(idrev)
            .populate('project', 'name')
            .populate('student', 'email');
        await Review.deleteOne({ _id: idrev });
        sendMailCancelRating(review, values);
        res.status(200).send('Review borrado con exito');
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};
