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

router.get(
  '/testQuestions',
  UserMiddleware.authenticate,
  QuestionsController.getTestQuestions,
);

router.delete(
  '/:id',
  UserMiddleware.authenticate,
  QuestionsController.deleteQuestion,
);
router.get(
  '/:id',
  UserMiddleware.authenticate,
  QuestionsController.getQuestionById,
);
router.put(
  '/:id',
  UserMiddleware.authenticate,
  QuestionsController.updateQuestion,
);

export default router;
