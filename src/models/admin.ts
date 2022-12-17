import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
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
    verify: {
        type: Boolean,
        default:false,
    },
    rol: {
        type: String,
        required: [true, 'Role is required'],
        default: 'ADMIN_ROL',
        emun: ['ADMIN_ROL'],
    },
    state:{
        type: Boolean,
        default:true
    }
});

AdminSchema.methods.toJSON = function () {
    const { __v, _id, ...admin } = this.toObject();
    admin.uid = _id;
    return admin;
};

module.exports = model('Admin', AdminSchema);
