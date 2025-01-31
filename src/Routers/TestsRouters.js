import express from 'express';
import TestController from '../Controllers/TestsControllers.js';
import UserMiddleware from '../Middlewares/UsersMiddlewares.js';

const router = express.Router();

router.get(
  '/allTests',
  UserMiddleware.authenticate,
  TestController.getAllTests,
);

router.get('/:id', UserMiddleware.authenticate, TestController.getTestById);

router.post('/create', UserMiddleware.authenticate, TestController.createTest);

router.put('/:id', UserMiddleware.authenticate, TestController.updateTest);

router.delete('/:id', UserMiddleware.authenticate, TestController.deleteTest);

export default router;
