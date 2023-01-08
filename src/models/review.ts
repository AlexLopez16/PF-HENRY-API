import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
    /*
        # Id
        * Id_Project
        * Id_Company
        * Id_Student
        + Description
        + Rating
    */
    description: {
        type: String,
    },
    ratingProject: {
        type: Number,
    },
    ratingCompany:{
        type:Number,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
});

ReviewSchema.methods.toJSON = function () {
    const { __v, _id, ...review } = this.toObject();
    return review;
};

module.exports = model('Review', ReviewSchema);
