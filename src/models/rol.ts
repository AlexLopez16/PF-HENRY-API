import { Schema, model } from 'mongoose';

const RolSchema = new Schema({
    Rol: {
        type: String,
        required: [true, 'Rol is required'],
        emun: ['STUDENT_ROL', 'COMPANY_ROL', 'ADMIN_ROL'],
    },
});

RolSchema.methods.toJSON = function () {
    const { __v, _id, ...rol } = this.toObject();
    return rol;
};

module.exports = model('Rol', RolSchema);
