import express from 'express';
import UserController from '../Controllers/UsersControllers.js';
import UserMiddleware from '../Middlewares/UsersMiddlewares.js';
import { rateLimiter, captureIp } from '../Utils/NetworkUtils.js';

const router = express.Router();

router.post('/register', captureIp, UserController.UserRegister);
router.post('/login', captureIp, UserController.UserLogin);
router.post(
  '/auth',
  captureIp,
  UserMiddleware.authenticate,
  UserController.UserAuth,
);
router.get('/allUsers', UserController.getAllUsers);

export default router;
