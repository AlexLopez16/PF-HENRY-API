import { Schema, model } from 'mongoose';

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is requiered'],
    },
    country: {
        type: String,
        required: [true, 'Country is requiered'],
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
    website: {
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
    premium: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
    project: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    Invoice: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Invoice',
        },
    ],
});

CompanySchema.methods.toJSON = function () {
    const { __v, _id, ...company } = this.toObject();
    company.uid = _id;
    return company;
};

module.exports = model('Company', CompanySchema);
