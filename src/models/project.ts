import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is requiered'],
    },
    description: {
        type: String,
        require: [true, 'Requires a description'],
    },
    participants: {
        type: Number,
        require: [true, 'Number of employees is required'],
    },
    requirements: {
        type: Array,
        require: [true, 'Language is required'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],
});

ProjectSchema.methods.toJSON = function () {
    const { __v, _id, ...project } = this.toObject();
    project.uid = _id;
    return project;
};

module.exports = model('Project', ProjectSchema);
