const Company = require('../models/company');
const Student = require('../models/student');

export const searchUser = async (id: string) => {
  let user = await Student.findById(id);
  if (!user) {
    user = await Company.findById(id);
  }
  return user;
};
