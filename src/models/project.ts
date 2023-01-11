import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
      
    },

    description: {
        type: String,
        required: [true, 'Requires a description'],
    },

    participants: {
        type: Number,
        required: [true, 'Number of employees is required'],
    },

    images: {
        type: Array,
    },

    questions: {
        type: Array,
        default: []
    },

    requirements: {
        type: Array,
        required: [true, 'Language is required'],
        index: true
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

    accepts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],

    category: {
        type: String,
        index: true
    },

    stateOfProject: {
        type: String,
        emun: ['Reclutamiento', 'En desarrollo', 'Terminado', 'En revision'],
        default: 'En revision',
        index: true
    },
    
    admission: {
        type: Date
    },   
     responses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Response'
        }
    ]
});

ProjectSchema.index({ name: 'text' });

ProjectSchema.methods.toJSON = function () {
    const { __v, _id, ...project } = this.toObject();
    project.uid = _id;
    return project;
};

module.exports = model('Project', ProjectSchema);
