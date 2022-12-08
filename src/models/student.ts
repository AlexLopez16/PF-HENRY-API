import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    image: {
        type: String,
    },
    state: {
        type: Boolean,
        default: true,
    },
    gmail: {
        type: Boolean,
        default: false,
    },
    github: {
        type: Boolean,
        default: false,
    },
});

StudentSchema.methods.toJSON = function () {
    const { __v, _id, ...student } = this.toObject();
    student.uid = _id;
    return student;
};

module.exports = model('Student', StudentSchema);
