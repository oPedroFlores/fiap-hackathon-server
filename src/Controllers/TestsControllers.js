import { checkMissingRequiredFields } from '../Utils/Utils.js';
import {
  thisSubjectExists,
  thisTopicExists,
  isValidDifficulty,
} from '../Utils/SubjectUtils.js';
import { thisGradeExists } from '../Utils/GradeUtils.js';
import TestsModels from '../Models/TestsModels.js';
import { thisTestIdBelongsToThisUser } from '../Utils/TestUtils.js';
const testController = {
  createTest: async (req, res) => {
    try {
      const requiredFields = [
        'testCode',
        'testName',
        'testType',
        'maxScore',
        'topic',
        'difficultyLevel',
        'numberOfQuestions',
        'accessibility',
      ];

      const missingFields = checkMissingRequiredFields(
        req.body,
        requiredFields,
      );
      if (!missingFields.success) {
        return res.status(400).json(missingFields);
      }

      //* Verificar se foi enviado questões, adicionar o createdBy
      if (!req.body.questions) {
        return res
          .status(400)
          .json({ message: 'Nenhuma questão foi enviada.', success: false });
      }

      const questions = req.body.questions.map((question) => ({
        ...question,
        createdBy: req.user._id,
      }));

      req.body.questions = questions;

      const subjectExists = await thisSubjectExists(
        req.body.subjectId,
        req.user._id,
      );
      if (!subjectExists) {
        return res
          .status(400)
          .json({ message: 'A matéria informada não existe.', success: false });
      }

      const topicExists = await thisTopicExists(
        req.body.subjectId,
        req.body.topic,
      );

      if (!topicExists) {
        return res
          .status(400)
          .json({ message: 'O topico informado não existe.', success: false });
      }

      const isValidDifficultyLevel = isValidDifficulty(
        req.body.difficultyLevel,
      );
      if (!isValidDifficultyLevel) {
        return res.status(400).json({
          message: 'A dificuldade informada não é valida.',
          success: false,
        });
      }

      const gradeExists = await thisGradeExists(req.body.gradeId, req.user._id);
      if (!gradeExists) {
        return res
          .status(400)
          .json({ message: 'A grade informada não existe.', success: false });
      }
      const newTestToCreate = {
        ...req.body,
      };
      const newTest = await TestsModels.createTest(
        newTestToCreate,
        req.user._id,
      );

      res.status(201).json(newTest);
    } catch (error) {
      console.error('Erro ao criar prova:', error);
      res
        .status(500)
        .json({ message: 'Erro ao criar prova.', error: error.message });
    }
  },

  getTestById: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Id da prova não foi informado.', success: false });
    }

    try {
      const belongsToUser = await thisTestIdBelongsToThisUser(id, req.user._id);

      if (belongsToUser.error) {
        return res.status(400).json({
          message: belongsToUser.error,
          success: false,
        });
      }

      const test = await TestsModels.getTestById(id);
      return res.status(200).json({ success: true, test });
    } catch (error) {
      console.error('Erro ao buscar prova:', error);
      return res.status(500).json({
        message: 'Erro ao buscar prova.',
        error: error.message,
        success: false,
      });
    }
  },

  getAllTests: async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;

    try {
      const result = await TestsModels.getAllTests(req.user._id, page, limit);

      const { tests, totalTests, totalPages } = result;
      res.status(200).json({
        success: true,
        page,
        totalPages,
        totalTests,
        tests,
      });
    } catch (error) {
      console.error('Erro ao buscar provas:', error);
      res.status(500).json({
        message: 'Erro ao buscar provas.',
        error: error.message,
        success: false,
      });
    }
  },

  updateTest: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Id da prova não foi informado.', success: false });
    }
    try {
      const belongsToUser = await thisTestIdBelongsToThisUser(id, req.user._id);

      if (belongsToUser.error) {
        return res.status(400).json({
          message: belongsToUser.error,
          success: false,
        });
      }

      const difficulties = ['Easy', 'Medium', 'Hard'];
      const difficultiesLowerCase = difficulties.map((difficulty) =>
        difficulty.toLowerCase(),
      );

      if (
        req.body.difficulty &&
        !difficultiesLowerCase.includes(req.body.difficulty.toLowerCase())
      ) {
        return res.status(400).json({
          message: 'Dificuldade deve estar entre easy, medium e hard.',
          success: false,
        });
      }

      if (req.body.subjectId) {
        const subjectExists = await thisSubjectExists(
          req.body.subjectId,
          req.user._id,
        );
        if (!subjectExists) {
          return res.status(400).json({
            message: 'A matéria informada não existe.',
            success: false,
          });
        }
      }

      if (req.body.subjectId && !req.body.topic) {
        return res.status(400).json({
          message: 'O topico não foi informado ao alterar a materia.',
          success: false,
        });
      }

      if (req.body.topic) {
        const topicExists = await thisTopicExists(
          req.body.subjectId,
          req.body.topic,
        );
        if (!topicExists) {
          return res.status(400).json({
            message: 'O topico informado não existe.',
            success: false,
          });
        }
      }

      if (req.body.gradeId) {
        const gradeExists = await thisGradeExists(
          req.body.gradeId,
          req.user._id,
        );
        if (!gradeExists) {
          return res
            .status(400)
            .json({ message: 'A grade informada não existe.', success: false });
        }
      }

      await TestsModels.updateTest(id, req.body);

      return res.status(200).json({
        message: 'Prova atualizada com sucesso.',
        success: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar prova:', error);

      return res.status(500).json({
        message: 'Erro ao atualizar prova.',
        error: error.message,
        success: false,
      });
    }
  },

  deleteTest: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Id da prova não foi informado.', success: false });
    }

    try {
      const belongsToUser = await thisTestIdBelongsToThisUser(id, req.user._id);

      if (belongsToUser.error) {
        return res.status(400).json({
          message: belongsToUser.error,
          success: false,
        });
      }

      await TestsModels.deleteTest(id);
      return res.status(200).json({
        message: 'Prova deletada com sucesso.',
        success: true,
      });
    } catch (error) {
      console.error('Erro ao deletar prova:', error);
      return res.status(500).json({
        message: 'Erro ao deletar prova.',
        error: error.message,
        success: false,
      });
    }
  },
};

export default testController;
