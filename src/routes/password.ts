import { Router } from 'express';
import { modifyPassword, password } from '../controllers/pasword';
import { verifyToken } from '../middlewares/authValidator';



const router = Router();

router.get('/',password);

router.put("/",modifyPassword );





module.exports = router;
