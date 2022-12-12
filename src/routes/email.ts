import { Router } from 'express';
import { confirmEmail } from '../controllers/email';
import {} from '../middlewares/authValidator';

const router = Router();

router.get('/:token', confirmEmail);

module.exports = router;
