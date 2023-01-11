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
        const { limit = 6, init = 6, name }: any = req.query;
        console.log('llego', name);
        let Limit = parseInt(limit);
        let Init = parseInt(init);

        if (name) {
            const count = [
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        let: { name: '$name' },
                        pipeline: [
                            {
                                $match: {
                                    name: {
                                        $regex: name,
                                        $options: 'i',
                                    },
                                },
                            },
                            { $project: { name: 1, company: 1 } },
                            {
                                $lookup: {
                                    from: 'companies',
                                    localField: 'company',
                                    foreignField: '_id',
                                    pipeline: [{ $project: { name: 1 } }],
                                    as: 'company',
                                },
                            },
                        ],
                        as: 'project',
                    },
                },
                {
                    $match: { project: { $size: 1 } },
                },
                {
                    $lookup: {
                        from: 'students',
                        localField: 'student',
                        foreignField: '_id',
                        pipeline: [{ $project: { name: 1 } }],
                        as: 'student',
                    },
                },
                {
                    $unionWith: {
                        coll: 'reviews',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'students',
                                    localField: 'student',
                                    foreignField: '_id',
                                    let: { name: '$name' },
                                    pipeline: [
                                        {
                                            $match: {
                                                name: {
                                                    $regex: name,
                                                    $options: 'i',
                                                },
                                            },
                                        },
                                        { $project: { name: 1 } },
                                    ],
                                    as: 'student',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'project',
                                    foreignField: '_id',
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: 'companies',
                                                localField: 'company',
                                                foreignField: '_id',
                                                pipeline: [
                                                    { $project: { name: 1 } },
                                                ],
                                                as: 'company',
                                            },
                                        },
                                        { $project: { name: 1, company: 1 } },
                                    ],
                                    as: 'project',
                                },
                            },
                            {
                                $match: { student: { $size: 1 } },
                            },
                        ],
                    },
                },
                {
                    $unionWith: {
                        coll: 'reviews',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'project',
                                    foreignField: '_id',
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: 'companies',
                                                localField: 'company',
                                                foreignField: '_id',
                                                let: { name: '$name' },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            name: {
                                                                $regex: name,
                                                                $options: 'i',
                                                            },
                                                        },
                                                    },
                                                    { $project: { name: 1 } },
                                                ],
                                                as: 'company',
                                            },
                                        },
                                        {
                                            $match: { company: { $size: 1 } },
                                        },
                                        { $project: { name: 1, company: 1 } },
                                    ],
                                    as: 'project',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'students',
                                    localField: 'student',
                                    foreignField: '_id',
                                    pipeline: [{ $project: { name: 1 } }],
                                    as: 'student',
                                },
                            },
                            {
                                $match: { project: { $size: 1 } },
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        description: { $first: '$description' },
                        project: { $first: '$project' },
                        student: { $first: '$student' },
                        ratingCompany: { $first: '$ratingCompany' },
                        ratingProject: { $first: '$ratingProject' },
                    },
                },

                {
                    $count: 'count',
                },
            ];
            const result1 = [
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        let: { name: '$name' },
                        pipeline: [
                            {
                                $match: {
                                    name: {
                                        $regex: name,
                                        $options: 'i',
                                    },
                                },
                            },
                            { $project: { name: 1, company: 1 } },
                            {
                                $lookup: {
                                    from: 'companies',
                                    localField: 'company',
                                    foreignField: '_id',
                                    pipeline: [{ $project: { name: 1 } }],
                                    as: 'company',
                                },
                            },
                        ],
                        as: 'project',
                    },
                },
                {
                    $match: { project: { $size: 1 } },
                },
                {
                    $lookup: {
                        from: 'students',
                        localField: 'student',
                        foreignField: '_id',
                        pipeline: [{ $project: { name: 1 } }],
                        as: 'student',
                    },
                },

                {
                    $unionWith: {
                        coll: 'reviews',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'students',
                                    localField: 'student',
                                    foreignField: '_id',
                                    let: { name: '$name' },
                                    pipeline: [
                                        {
                                            $match: {
                                                name: {
                                                    $regex: name,
                                                    $options: 'i',
                                                },
                                            },
                                        },
                                        { $project: { name: 1 } },
                                    ],
                                    as: 'student',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'project',
                                    foreignField: '_id',
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: 'companies',
                                                localField: 'company',
                                                foreignField: '_id',
                                                pipeline: [
                                                    { $project: { name: 1 } },
                                                ],
                                                as: 'company',
                                            },
                                        },
                                        { $project: { name: 1, company: 1 } },
                                    ],
                                    as: 'project',
                                },
                            },
                            {
                                $match: { student: { $size: 1 } },
                            },
                        ],
                    },
                },
                {
                    $unionWith: {
                        coll: 'reviews',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'project',
                                    foreignField: '_id',
                                    pipeline: [
                                        {
                                            $lookup: {
                                                from: 'companies',
                                                localField: 'company',
                                                foreignField: '_id',
                                                let: { name: '$name' },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            name: {
                                                                $regex: name,
                                                                $options: 'i',
                                                            },
                                                        },
                                                    },
                                                    { $project: { name: 1 } },
                                                ],
                                                as: 'company',
                                            },
                                        },
                                        {
                                            $match: { company: { $size: 1 } },
                                        },
                                        { $project: { name: 1, company: 1 } },
                                    ],
                                    as: 'project',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'students',
                                    localField: 'student',
                                    foreignField: '_id',
                                    pipeline: [{ $project: { name: 1 } }],
                                    as: 'student',
                                },
                            },
                            {
                                $match: { project: { $size: 1 } },
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        description: { $first: '$description' },
                        project: { $first: '$project' },
                        student: { $first: '$student' },
                        ratingCompany: { $first: '$ratingCompany' },
                        ratingProject: { $first: '$ratingProject' },
                    },
                },
            ];
            // const result2 = await Review.aggregate(result1);
            // let total;
            const [total, getreviews] = await Promise.all([
                Review.aggregate(count),

                Review.aggregate(result1).limit(Limit).skip(Init),
            ]);
            console.log(total);
            let tol;
            if (total[0]) {
                tol = total[0].count;
            } else {
                tol = 0;
            }
            // let set;
            // let array = result2;

            //   if(result2.length>1){
            //    set=new Set (result2)
            //    total=set.values.length
            //    array=Array.from(set)
            //   }else{
            //     total=count
            //   }
            // if (result3.length > 1) {
            //     total = 1 + (result2 - result3.length);
            // } else {
            //     total = count;
            // }
            // const result3 = await Review.aggregate(count);
            return res.status(200).send({ total: tol, getreviews });
        }
        let [total, getreviews] = await Promise.all([
            await Review.countDocuments({}),
            await Review.find({})
                .limit(limit)
                .skip(init)

                .populate({
                    path: 'student',
                    select: 'name email',
                })
                .populate({
                    path: 'project',

                    populate: {
                        path: 'company',
                        select: 'name ',
                    },
                }),
        ]);
        console.log(getreviews);
        res.status(200).send({ total, getreviews });
    } catch (error) {
        res.status(500).send({ error: 'sss' });
        console.log(error);
    }
};

export const deleteReview: RequestHandler = async (req, res) => {
    try {
        const { idrev, values } = req.body;
        console.log(idrev,values);
        
        let review = await Review.findById(idrev)
            .populate('project', 'name')
            .populate('student', 'email');
            sendMailCancelRating(review, values);
            await Review.deleteOne({ _id: idrev });
        res.status(200).send('Review borrado con exito');
    } catch (error: any) {
        res.status(500).json(formatError(error.message));
    }
};
