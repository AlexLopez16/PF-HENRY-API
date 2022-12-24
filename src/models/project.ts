import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Requires a description'],
  },
  participants: {
    type: Number,
    required: [true, 'Number of employees is required'],
  },
  images: {
    type: Array
  },
  requirements: {
    type: Array,
    required: [true, 'Language is required'],
  },
 
  state: {
    type: Boolean,
    default: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],

  accepts: {
    type: Array
  },

  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  category:{
    type:String
  },
  stateOfProject: {
    type: String,
    emun: ['Reclutamiento', 'En desarrollo', 'Terminado']
  }
});

ProjectSchema.index({ name: 'text' });

ProjectSchema.methods.toJSON = function () {
  const { __v, _id, ...project } = this.toObject();
  project.uid = _id;
  return project;
};

module.exports = model('Project', ProjectSchema);
