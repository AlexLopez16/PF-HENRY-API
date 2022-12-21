import { Schema, model } from 'mongoose';

const CompanySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  country: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
  },
  website: {
    type: String,
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
  verify: {
    type: Boolean,
    default: false,
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
  rol: {
    type: String,
    required: [true, 'Role is required'],
    default: 'COMPANY_ROL',
    emun: ['COMPANY_ROL'],
  },
});

CompanySchema.methods.toJSON = function () {
  const { __v, _id, ...company } = this.toObject();
  company.uid = _id;
  return company;
};

module.exports = model('Company', CompanySchema);
