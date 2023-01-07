import { Router } from 'express';
import { infoToken } from '../controllers/token';
import { verifyToken } from '../middlewares/authValidator';

const router = Router();

router.get(
    '/',
    // no necesita el verifytokeb.
    infoToken
);

module.exports = router;
