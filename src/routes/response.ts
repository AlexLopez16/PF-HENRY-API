import { Router } from 'express';
import { createResponse } from '../controllers/response';
import { verifyToken } from '../middlewares/authValidator';

const router = Router();
router.post('/', verifyToken , createResponse)

module.exports = router