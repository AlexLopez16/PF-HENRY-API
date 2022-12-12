import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String,
       
    },
    email: {
        type: String,
        unique: true
    },
    country: {
        type: String,
    },
    password: {
        type: String
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    state: {
        type: Boolean,
        default: true
    },
    gmail: {
        type: Boolean,
        default: false
    },
    github: {
        type: Boolean,
        default: false
    },
    tecnologies: {
        type: Array,
    },
    rol: {
        type: String,
        required: [true, 'Role is required'],
        default: 'STUDENT_ROL',
        emun: ['STUDENT_ROL'],
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
});

StudentSchema.methods.toJSON = function () {
    const { __v, _id, ...student } = this.toObject();
    student.uid = _id;
    return student;
};

module.exports = model('Student', StudentSchema);
