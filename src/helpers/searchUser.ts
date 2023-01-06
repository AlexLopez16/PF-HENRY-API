import { sendConfirmationEmail } from './sendConfirmationEmail';

const Company = require('../models/company');
const Student = require('../models/student');
const Admin = require('../models/admin');

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

export const searchUserForVerify = async (
    who: string | any,
    _id: string,
    email: string
) => {
    try {
        const functions: object | any = {
            Student: async (_id: object | any) => {
                return await Student.findOne({ _id });
            },
            Company: async (_id: object | any) => {
                return await Company.findOne({ _id });
            },
            Admin: async (_id: object | any) => {
                return await Admin.findOne({ _id });
            },
        };
        const user = functions[who];
        if (user) {
            if (user.email === email) await sendConfirmationEmail(user);
            else {
                user.email = email;
                await user.save();
                await sendConfirmationEmail(user);
            }
        } else throw new Error('Usuario no encontrado.');
        return user;
    } catch (error: any) {
        console.log(error.message);
    }
};
