import { RequestHandler } from 'express';

export const infoToken: RequestHandler = async (req, res) => {
    const { _id: id, rol, verify } = req.user;
    res.status(200).json({ data: 'Token info', rol, verify, id });
};
