import { Router } from 'express';
import { modifyPassword, password } from '../controllers/password';
import { verifyToken } from '../middlewares/authValidator';



const router = Router();

router.get('/',password);

router.put("/",verifyToken,modifyPassword );





module.exports = router;
