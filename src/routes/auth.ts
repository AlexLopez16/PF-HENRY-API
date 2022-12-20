import { Router } from 'express';
import { loginUser, github } from '../controllers/auth';

const router = Router();

router.post('/', loginUser);

router.get('/', github);

module.exports = router;
