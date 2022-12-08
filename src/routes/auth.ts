import { Router } from 'express';
import { loginUser, github } from '../controllers/auth';
import {} from '../middlewares/authValidator';

const router = Router();

router.post('/', loginUser);

router.get('/', github);

module.exports = router;
