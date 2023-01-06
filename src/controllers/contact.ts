import { RequestHandler } from 'express';
import path from 'path';
import { contactEmail } from '../helpers/sendConfirmationEmail';
const ejs = require('ejs')

export const sendContactEmail: RequestHandler = async (req, res) => {
    const { name, email, message } = req.body

    const _path = path.join(__dirname, '..', 'emails')

    ejs.renderFile(_path + '/Contact.ejs', { name, email, message }, async(error: any, data: any) => {
        if (error) {
            console.log(error)
        } else {
            const response = await contactEmail(data, name)
            res.json(response)
        }
    })
}