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
    Description: {
        type: String,
    },
    Rating: {
        type: Array,
    },
});

ReviewSchema.methods.toJSON = function () {
    const { __v, _id, ...review } = this.toObject();
    return review;
};

module.exports = model('Review', ReviewSchema);
