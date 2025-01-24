import { checkMissingRequiredFields } from '../Utils/Utils.js';
import {
  thisSubjectExists,
  thisTopicExists,
  hasFourAlternatives,
  isValidDifficulty,
} from '../Utils/SubjectUtils.js';
import { thisGradeExists } from '../Utils/GradeUtils.js';
import QuestionModels from '../Models/QuestionsModels.js';
const createQuestion = async (req, res) => {
  try {
    //* Todos os campos foram enviados?
    const requiredFields = [
      'statement',
      'alternatives',
      'correctAnswer',
      'difficulty',
      'subject',
      'topic',
      'grade',
    ];

    const missingFields = checkMissingRequiredFields(req.body, requiredFields);
    if (!missingFields.success) {
      return res.status(400).json(missingFields);
    }

    //* Verificar se este subject (materia) existe
    const subjectExists = await thisSubjectExists(req.body.subject);
    if (!subjectExists) {
      return res
        .status(400)
        .json({ message: 'A matéria informada nao existe.', success: false });
    }

    //* Verificar se este topic (topico) existe
    const topicExists = await thisTopicExists(req.body.subject, req.body.topic);
    if (!topicExists) {
      return res
        .status(400)
        .json({ message: 'O topico informado nao existe.', success: false });
    }

    //* Tem *exatamente* 4 alternativas?
    const isFourAlternatives = hasFourAlternatives(req.body.alternatives);
    if (!isFourAlternatives) {
      return res.status(400).json({
        message: 'A questão precisa de 4 alternativas.',
        success: false,
      });
    }

    //* A dificuldade informada é valida?
    const isValidDifficultyLevel = isValidDifficulty(req.body.difficulty);
    if (!isValidDifficultyLevel) {
      return res.status(400).json({
        message: 'A dificuldade informada nao é valida.',
        success: false,
      });
    }

    //* A correct answer é entre 0 e 3?
    if (
      req.body.correctAnswer < 0 ||
      req.body.correctAnswer > req.body.alternatives.length - 1
    ) {
      return res.status(400).json({
        message: 'A resposta correta precisa estar entre 0 e 3.',
        success: false,
      });
    }

    //* A grade enviada está correta?
    const gradeExists = await thisGradeExists(req.body.grade);
    if (!gradeExists) {
      return res
        .status(400)
        .json({ message: 'A grade informada nao existe.', success: false });
    }

    //* Criando a questão
    const newQuestion = await QuestionModels.createQuestion(req.body, req.user);

    if (!newQuestion) {
      return res
        .status(400)
        .json({ message: 'Erro ao criar a questão.', success: false });
    }

    return res.status(201).json({
      message: 'Questão criada com sucesso.',
      success: true,
    });
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    return res
      .status(500)
      .json({
        message: 'Erro ao criar questão.',
        error: error.message,
        success: false,
      });
  }
};

export default { createQuestion };
