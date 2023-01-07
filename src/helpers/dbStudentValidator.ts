const Rol = require('../models/rol');
const Student = require('../models/student');

// Verificamos que el rol exista.
export const validateStudentRol = async (rol: string) => {
    const roleExist = await Rol.findOne({ rol });
    if (!roleExist) throw new Error(`Role ${rol} invalido`);
};

// Verificamos que el email no exista.
export const validateStudentEmail = async (email: string) => {
    // Primero buscamos en la base de datos.
    const searchEmail = await Student.findOne({ email });
    // Si ya esta registrado devolvemos un erros.
    if (searchEmail) throw new Error('El email ya esta registrado');
};
