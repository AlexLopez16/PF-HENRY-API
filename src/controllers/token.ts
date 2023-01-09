import { RequestHandler } from 'express';
import { verifyJwt } from '../helpers/verifyJwt';
import { searchUser } from '../helpers/searchUser';
import { formatError } from '../utils/formatErros';

export const infoToken: RequestHandler = async (req, res) => {
    // const { _id: id, rol, verify } = req.user;
    try {
        const token = req.header('user-token');
        let { id } = verifyJwt(token);
        const user = await searchUser(id);
        if (!user.state && user.github) {
            throw new Error(
                'Tu cuenta ha sido inactivada, por favor llena el formulario de contactanos para darte respuesta'
            );
        }
        const { rol, id: uid, verify, email, state } = user;
        id = uid;
        res.status(200).json({
            data: 'Token info',
            rol,
            verify,
            id,
            email,
            state,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json(formatError(error.message));
    }
};
