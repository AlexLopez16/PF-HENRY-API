import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { searchUser } from '../helper/searchUser';
import { formatError } from '../utils/formatErros';
require('dotenv').config();

// Este declare nos permite crear nuestras porpias requests.

declare global {
    namespace Express {
        interface Request {
            user: any; //or can be anythin
        }
    }
}

// const pathsWithoutAuth = new Map<string, Set<string>>();
// pathsWithoutAuth.set('/api/auth', new Set(['POST', 'GET', 'OPTIONS']));
// pathsWithoutAuth.set('/account/confirm', new Set(['GET', 'OPTIONS']));
// pathsWithoutAuth.set('/api/student', new Set(['POST', 'OPTIONS']));
// pathsWithoutAuth.set('/api/company', new Set(['POST', 'OPTIONS']));
// pathsWithoutAuth.set('/api/project', new Set(['OPTIONS']));
// pathsWithoutAuth.set('/api/invoice', new Set(['OPTIONS']));

export const verifyToken: RequestHandler = async (req, res, next) => {
    let requestUri: string = req.originalUrl;
    // const baseUrl =
    //     requestUri.indexOf('?') === -1
    //         ? requestUri
    //         : requestUri.slice(0, requestUri.indexOf('?'));
    // if (pathsWithoutAuth.get(baseUrl)?.has(req.method)) {
    //     next();
    //     return;
    // }
    const token = req.header('user-token');
    if (!token) return res.status(401).json(formatError('Access denied'));
    try {
        const { id } = jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
        ) as JwtPayload;
        const user = await searchUser(id);
        req.user = user;
        if (!user.verify) throw new Error('Confirm your email');
        next();
    } catch (error: any) {
        return res.status(500).json(formatError(error.message));
    }
};
