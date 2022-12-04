import { Schema, model } from 'mongoose';

const UserCompany = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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

  gmail: {
    type: Boolean,
    default: false,
  },

  country: {
    type: String,
    required: [true, 'Country is required'],
  },

  premium: {
    type: Boolean,
    default: false,
  },
});

UserCompany.methods.toJSON = function () {
  const { __v, _id, ...UserCompany } = this.toObject();
  UserCompany.uid = _id;
  return UserCompany;
};

module.exports = model('UserCompany', UserCompany);
