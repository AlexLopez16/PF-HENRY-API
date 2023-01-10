import { Schema, model } from 'mongoose';

const ResponseSchema = new Schema({
    response: {
        type: Array
    },
    studenId: {
        type: Schema.Types.ObjectId,
    },
    projectId: {
        type: Schema.Types.ObjectId,
    }
})

ResponseSchema.methods.toJSON = function () {
    const { __v, _id, ...response } = this.toObject();
    response.uid = _id;
    return response;
};

module.exports = model('Response', ResponseSchema);