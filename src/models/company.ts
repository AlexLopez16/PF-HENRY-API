import { Schema, model } from "mongoose";

const BusinessSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is requiered']
    },
    country: {
        type: String,
        require: [true, 'Country is requiered']
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    website: {
        type: String
    },
    state: {
        type: Boolean,
        default: true
    },
    gmail: {
        type: Boolean,
        default: false,
    },
    premium: {
        type: Boolean,
        default: false,
    }
})

BusinessSchema.methods.toJSON = function () {
    const { __v, _id, ...bussiness} = this.toObject()
    bussiness.uid = _id
    return bussiness
}

module.exports = model('Bussiness', BusinessSchema)