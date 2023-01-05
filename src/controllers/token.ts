import { RequestHandler } from 'express';
import { verifyJwt } from '../helpers/verifyJwt';
import { searchUser } from '../helpers/searchUser';

export const infoToken: RequestHandler = async (req, res) => {
    // const { _id: id, rol, verify } = req.user;
    try {
        const token = req.header('user-token');
        let { id } = verifyJwt(token);
        const user = await searchUser(id);
        const { rol, id: uid, verify, email } = user;
        id = uid;
        res.status(200).json({ data: 'Token info', rol, verify, id, email });
    } catch (error) {}
};
