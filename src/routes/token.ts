import { Router } from 'express';
import { infoToken } from '../controllers/token';
import { verifyToken } from '../middlewares/authValidator';

const router = Router();

router.get('/', verifyToken, infoToken);

module.exports = router;
