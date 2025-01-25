import express from 'express';
import GradesController from '../Controllers/GradesControllers.js';
import UserMiddleware from '../Middlewares/UsersMiddlewares.js';

const router = express.Router();

router.get(
  '/allGrades',
  UserMiddleware.authenticate,
  GradesController.getAllGrades,
);

router.post(
  '/create',
  UserMiddleware.authenticate,
  GradesController.createGrade,
);

router.put('/:id', UserMiddleware.authenticate, GradesController.updateGrade);

router.delete(
  '/:id',
  UserMiddleware.authenticate,
  GradesController.deleteGrade,
);

export default router;
