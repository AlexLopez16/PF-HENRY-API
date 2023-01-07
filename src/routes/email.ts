import { Router } from 'express';
import { confirmEmail, isVerify, reSendEmail } from '../controllers/email';
import {} from '../middlewares/authValidator';

const router = Router();

router.get('/:token', confirmEmail);
router.get('/isverify/:email', isVerify);
router.put('/resendemail', reSendEmail);

module.exports = router;
