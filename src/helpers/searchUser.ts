const Company = require('../models/company');
const Student = require('../models/student');
const Admin   = require('../models/admin');

export const searchUser = async (id: string) => {
    let user = await Student.findById(id);
    if (!user) {
        user = await Company.findById(id);
    }
    if (!user) {
        user = await Admin.findById(id);
    }
    return user;
};
