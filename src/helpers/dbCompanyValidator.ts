const Company = require('../models/company');
const Rol = require('../models/rol');

export const validateCompanyRol = async (rol: string) => {
    const roleExist = await Rol.findOne({ rol });
    if (!roleExist) throw new Error('Error');
};
