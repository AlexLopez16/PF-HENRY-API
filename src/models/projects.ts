import { Schema, model } from "mongoose";

const ProyectSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is requiered']
    },
    description: {
        type: Text,
        require: [true, 'Requires a description']
    },
    Number_of_employees: {
        type: String,
        require: [true, 'Number of employees is required']
    },
    language: {
        type: String,
        require: [true, 'Language is required']
    },
    state: {
        type: Boolean,
        default: true
    },
}) 

ProyectSchema.methods.toJSON = function () {
    const { __v, _id, ...proyects} = this.toObject()
    proyects.uid = _id
    return proyects
}

module.exports = model('Proyects', ProyectSchema)