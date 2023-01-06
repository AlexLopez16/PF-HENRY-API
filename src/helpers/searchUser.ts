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
            'Student': async () => {
                return await Student.findOne({ _id });
            },
            'Company': async () => {
                return await Company.findOne({ _id });
            },
            "Admin": async () => {
                return await Admin.findOne({ _id });
            },
        };
        const user = await functions[who]()
        console.log(user);
        if (user) {
            if (user.email === email) sendConfirmationEmail(user);
            else {
                user.email = email;
                await user.save();
                sendConfirmationEmail(user);
            }
        } else throw new Error('Usuario no encontrado.');
        return user;
    } catch (error: any) {
        console.log(error.message);
    }
};
