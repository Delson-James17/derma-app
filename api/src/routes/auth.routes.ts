import { Router } from 'express';
import { login, register, updateProfile, deleteAccount, logout} from '../../controllers/auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.put('/profile', updateProfile);
router.delete('/delete', authenticate, deleteAccount);
router.post('/logout', logout);

export default router;
