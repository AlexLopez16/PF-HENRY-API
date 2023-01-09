import { Router } from 'express';
import { sendContactEmail } from '../controllers/contact';

const router = Router();

router.post('/', sendContactEmail);

module.exports = router;
