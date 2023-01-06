import { Router } from 'express';
import { confirmEmail, reSendEmail } from '../controllers/email';
import {} from '../middlewares/authValidator';

const router = Router();

router.get('/:token', confirmEmail);
router.put('/resendemail', reSendEmail);

module.exports = router;
