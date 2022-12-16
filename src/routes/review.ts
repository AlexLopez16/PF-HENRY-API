import { Router } from 'express';
import { getReview, createReview } from '../controllers/review';
import { verifyToken } from '../middlewares/authValidator';

const router = Router();

router.get('/', verifyToken ,getReview)
router.get('/:id', verifyToken ,getReview)
router.post('/', verifyToken ,createReview)


module.exports = router