import express from 'express';
import UserMiddleware from '../Middlewares/UsersMiddlewares.js';
import QuestionsController from '../Controllers/QuestionsControllers.js';
const router = express.Router();

router.get(
  '/allQuestions',
  UserMiddleware.authenticate,
  QuestionsController.getAllQuestions,
);
router.post(
  '/create',
  UserMiddleware.authenticate,
  QuestionsController.createQuestion,
);

export default router;
