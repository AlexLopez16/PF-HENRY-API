import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is requiered'],
    },
    description: {
        type: String,
        required: [true, 'Requires a description'],
    },
    participants: {
        type: Number,
        required: [true, 'Number of employees is required'],
    },
    requirements: {
        type: Array,
        required: [true, 'Language is required'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    // image: {
    //     type: String,
    // },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId ,
            ref: 'Review'
        }
    ]
});

ProjectSchema.methods.toJSON = function () {
    const { __v, _id, ...project } = this.toObject();
    project.uid = _id;
    return project;
};

module.exports = model('Project', ProjectSchema);
