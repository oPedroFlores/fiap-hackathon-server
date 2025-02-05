import { checkMissingRequiredFields } from '../Utils/Utils.js';
import {
  thisSubjectExists,
  thisTopicExists,
  hasFourAlternatives,
  isValidDifficulty,
} from '../Utils/SubjectUtils.js';
import { thisGradeExists } from '../Utils/GradeUtils.js';
import QuestionModels from '../Models/QuestionsModels.js';
import {
  thisQuestionIdBelongsToThisUser,
  thisQuestionIdBelongsToThisUserOrIsPublic,
} from '../Utils/QuestionUtils.js';
const createQuestion = async (req, res) => {
  try {
    //* Todos os campos foram enviados?
    const requiredFields = [
      'statement',
      'alternatives',
      'correctAnswer',
      'difficulty',
      'subjectId',
      'topic',
      'gradeId',
    ];

    const missingFields = checkMissingRequiredFields(req.body, requiredFields);
    if (!missingFields.success) {
      return res.status(400).json(missingFields);
    }

    //* Verificar se este subject (materia) existe
    const subjectExists = await thisSubjectExists(
      req.body.subjectId,
      req.user._id,
    );
    if (!subjectExists) {
      return res
        .status(400)
        .json({ message: 'A matéria informada não existe.', success: false });
    }

    //* Verificar se este topic (topico) existe
    const topicExists = await thisTopicExists(
      req.body.subjectId,
      req.body.topic,
    );
    if (!topicExists) {
      return res
        .status(400)
        .json({ message: 'O topico informado não existe.', success: false });
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
        message: 'A dificuldade informada não é valida.',
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
    const gradeExists = await thisGradeExists(req.body.gradeId, req.user._id);
    if (!gradeExists) {
      return res
        .status(400)
        .json({ message: 'A grade informada não existe.', success: false });
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
    return res.status(500).json({
      message: 'Erro ao criar questão.',
      error: error.message,
      success: false,
    });
  }
};

const getAllQuestions = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  try {
    const result = await QuestionModels.getAllQuestions(
      req.user._id,
      page,
      limit,
    );

    const { questions, totalQuestions, totalPages } = result;

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages,
      totalQuestions,
      questions,
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return res.status(500).json({
      message: 'Erro ao buscar questões.',
      error: error.message,
      success: false,
    });
  }
};

const deleteQuestion = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Id da questão não foi informado.', success: false });
  }
  try {
    //* Essa questão é deste usuário?
    const belongsToUser = await thisQuestionIdBelongsToThisUser(
      id,
      req.user._id,
    );
    if (belongsToUser.error) {
      return res.status(400).json({
        message: belongsToUser.error,
        success: false,
      });
    }
    await QuestionModels.deleteQuestion(id);
    return res.status(200).json({
      message: 'Questão deletada com sucesso.',
      success: true,
    });
  } catch (error) {
    console.error('Erro ao deletar questão:', error);
    return res.status(500).json({
      message: 'Erro ao deletar questão.',
      error: error.message,
      success: false,
    });
  }
};

const getQuestionById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Id da questão não foi informado.', success: false });
  }
  try {
    //* Essa questão é deste usuário ou é pública ?
    const belongsToUser = await thisQuestionIdBelongsToThisUserOrIsPublic(
      id,
      req.user._id,
    );

    if (belongsToUser.error) {
      return res.status(400).json({
        message: belongsToUser.error,
        success: false,
      });
    }

    const question = await QuestionModels.getQuestionById(id);
    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error('Erro ao buscar questão:', error);
    return res.status(500).json({
      message: 'Erro ao buscar questão.',
      error: error.message,
      success: false,
    });
  }
};

const updateQuestion = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Id da questão não foi informado.', success: false });
  }
  try {
    //* Verificar se essa questão existe e pertence ao usuário
    const belongsToUser = await thisQuestionIdBelongsToThisUser(
      id,
      req.user._id,
    );
    if (belongsToUser.error) {
      return res.status(400).json({
        message: belongsToUser.error,
        success: false,
      });
    }

    if (req.body.alternatives) {
      //* Tem quantidade de alternativas suficiente?
      if (!hasFourAlternatives(req.body.alternatives)) {
        return res.status(400).json({
          message: 'Quantidade de alternativas insuficiente.',
          success: false,
        });
      }
    }

    if (req.body.correctAnswer) {
      //* Correct answer deve ser uma das alternativas
      if (req.body.correctAnswer < 0 || req.body.correctAnswer > 3) {
        return res.status(400).json({
          message: 'Resposta correta deve ser uma das alternativas.',
          success: false,
        });
      }
    }

    //* Dificuldade deve estar entre facil, medio e dificil
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

    //* Verificar se este subject (materia) existe
    if (req.body.subjectId) {
      const subjectExists = await thisSubjectExists(
        req.body.subjectId,
        req.user._id,
      );
      if (!subjectExists) {
        return res
          .status(400)
          .json({ message: 'A matéria informada não existe.', success: false });
      }
    }

    //* Ao trocar o subject, deve ser enviado o novo topic
    if (req.body.subjectId && !req.body.topic) {
      return res.status(400).json({
        message: 'O topico não foi informado ao alterar a materia.',
        success: false,
      });
    }

    //* Verificar se este topic (topico) existe
    if (req.body.topic) {
      const topicExists = await thisTopicExists(
        req.body.subjectId,
        req.body.topic,
      );
      if (!topicExists) {
        return res
          .status(400)
          .json({ message: 'O topico informado não existe.', success: false });
      }
    }

    //* A grade enviada está correta?
    if (req.body.gradeId) {
      const gradeExists = await thisGradeExists(req.body.gradeId, req.user._id);
      if (!gradeExists) {
        return res
          .status(400)
          .json({ message: 'A grade informada não existe.', success: false });
      }
    }

    //* Atualizar questão
    await QuestionModels.updateQuestion(id, req.body);
    return res.status(200).json({
      message: 'Questão atualizada com sucesso.',
      success: true,
    });
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    return res.status(500).json({
      message: 'Erro ao atualizar questão.',
      error: error.message,
      success: false,
    });
  }
};

//* Função para pegar questões para uma prova de acordo com filtros
const getTestQuestions = async (req, res) => {
  const rawFilters = {
    difficulty: req.body.difficulty || null,
    subject: req.body.subjectId || null,
    topic: req.body.topic || null,
    grade: req.body.gradeId || null,
    isPublic: req.body.isPublic || null,
    accessibility: req.body.accessibility || null,
  };

  // Remove campos com valor null
  const filters = Object.fromEntries(
    Object.entries(rawFilters).filter(([_, value]) => value !== null),
  );

  // Verifica se o objeto `filters` ficou vazio
  if (Object.keys(filters).length === 0) {
    return res.status(400).json({
      message: 'Nenhum filtro foi enviado.',
      success: false,
    });
  }

  try {
    // Dificuldade deve estar entre Easy, Medium e Hard
    if (filters.difficulty) {
      if (!isValidDifficulty(filters.difficulty)) {
        return res.status(400).json({
          message: 'Dificuldade deve estar entre Easy, Medium e Hard.',
          success: false,
        });
      }
    }
    // Verificar se este subject (materia) existe
    if (filters.subject) {
      const subjectExists = await thisSubjectExists(
        filters.subject,
        req.user._id,
      );
      if (!subjectExists) {
        return res.status(400).json({
          message: 'A materia informada nao existe.',
          success: false,
        });
      }
    }

    // Verificar se este topic (topico) existe
    if (filters.topic) {
      const topicExists = await thisTopicExists(filters.subject, filters.topic);
      if (!topicExists) {
        return res.status(400).json({
          message: 'O topico informado nao existe.',
          success: false,
        });
      }
    }

    // A grade enviada está correta?
    if (filters.grade) {
      const gradeExists = await thisGradeExists(filters.grade, req.user._id);
      if (!gradeExists) {
        return res.status(400).json({
          message: 'A grade informada nao existe.',
          success: false,
        });
      }
    }

    // Quantidade de questões deve estar entre 1 e 100
    if (req.body.amountOfQuestions) {
      if (req.body.amountOfQuestions < 0 || req.body.amountOfQuestions > 100) {
        return res.status(400).json({
          message: 'A quantidade de questões deve estar entre 1 e 100.',
          success: false,
        });
      }
    }

    // O getPublicQuestions deve ser booleano
    if (filters.getPublicQuestions) {
      if (!isValidBoolean(filters.getPublicQuestions)) {
        return res.status(400).json({
          message: 'O getPublicQuestions deve ser booleano.',
          success: false,
        });
      }
    }

    // O getAccessibilityQuestions deve ser booleano
    if (filters.getAccessibilityQuestions) {
      if (!isValidBoolean(filters.getAccessibilityQuestions)) {
        return res.status(400).json({
          message: 'O getAccessibilityQuestions deve ser booleano.',
          success: false,
        });
      }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = req.body.amountOfQuestions || 10;

    const result = await QuestionModels.getTestQuestions(
      req.user._id,
      filters,
      page,
      limit,
    );

    const { questions, totalQuestions, totalPages } = result;

    return res
      .status(200)
      .json({ success: true, totalQuestions, totalPages, page, questions });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return res.status(500).json({
      message: 'Erro ao buscar questões.',
      error: error.message,
      success: false,
    });
  }
};

export default {
  createQuestion,
  getAllQuestions,
  deleteQuestion,
  getQuestionById,
  updateQuestion,
  getTestQuestions,
};
