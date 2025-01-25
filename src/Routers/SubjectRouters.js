import express from 'express';
import SubjectsControllers from '../Controllers/SubjectsControllers.js';
import UserMiddleware from '../Middlewares/UsersMiddlewares.js';

const router = express.Router();

router.get(
  '/allSubjects',
  UserMiddleware.authenticate,
  SubjectsControllers.getAllSubjects,
);

router.post(
  '/create',
  UserMiddleware.authenticate,
  SubjectsControllers.createSubject,
);

router.put(
  '/:id',
  UserMiddleware.authenticate,
  SubjectsControllers.updateSubject,
);

router.delete(
  '/:id',
  UserMiddleware.authenticate,
  SubjectsControllers.deleteSubject,
);

export default router;
