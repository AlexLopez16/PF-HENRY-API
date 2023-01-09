import { Router } from 'express';
import { modifyPassword, password, redirectPassword } from '../controllers/password';
import { verifyToken } from '../middlewares/authValidator';



const router = Router();

router.get('/', password);
router.get('/redirect/:token', redirectPassword)

router.put("/", verifyToken, modifyPassword);





module.exports = router;
