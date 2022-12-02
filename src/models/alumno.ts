import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
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
    slack: {
        type: Boolean,
        default: false
    },
    premium: {
        type: Boolean,
        default: false
    }
})

UserSchema.methods.toJSON = function () {
    const { __v, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}


module.exports = model('User', UserSchema);