import mongoose from 'mongoose';
import questionSchema from '../Schemas/questionSchema.js';

// Cria o modelo com base no schema
const QuestionModel = mongoose.model('Question', questionSchema);
const getQuestionsModel = new mongoose.Schema({
  statement: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
});

const createQuestion = async (question, user) => {
  try {
    const newQuestion = await QuestionModel.create({
      ...question,
      subject: question.subjectId,
      topic: question.topic,
      grade: question.gradeId,
      isPublic: question.isPublic || false,
      accessibility: question.accessibility || false,
      createdBy: user._id,
    });
    return newQuestion;
  } catch (error) {
    throw new Error('Erro ao criar pergunta: ' + error.message);
  }
};

const getAllQuestions = async (userId, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const totalQuestions = await QuestionModel.countDocuments({
      $or: [{ createdBy: userId }, { isPublic: true }],
    });

    const questions = await QuestionModel.find({
      $or: [{ createdBy: userId }, { isPublic: true }],
    })
      .populate('createdBy', 'personalInfo.name personalInfo.email')
      .populate('subject', 'name')
      .populate('grade', 'name')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalQuestions / limit);

    return {
      questions,
      totalQuestions,
      totalPages,
    };
  } catch (error) {
    throw new Error('Erro ao buscar perguntas: ' + error.message);
  }
};

const deleteQuestion = async (id) => {
  try {
    await QuestionModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Erro ao deletar pergunta: ' + error.message);
  }
};

const getQuestionById = async (id) => {
  try {
    const question = await QuestionModel.findById(id)
      .populate({
        path: 'createdBy',
        select: 'personalInfo.name personalInfo.lastName',
      })
      .populate('subject', 'name')
      .populate('grade', 'name');

    return question;
  } catch (error) {
    throw new Error('Erro ao buscar pergunta: ' + error.message);
  }
};

const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const updateQuestion = async (id, question) => {
  try {
    await QuestionModel.findByIdAndUpdate(
      id,
      {
        ...question,
        subject: question.subjectId,
        grade: question.gradeId,
        difficulty: capitalize(question.difficulty),
      },
      { new: true },
    );
  } catch (error) {
    throw new Error('Erro ao atualizar pergunta: ' + error.message);
  }
};

const getTestQuestions = async (userId, filters, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    if (filters.subjectId) {
      filters.subject = filters.subjectId;
    }

    const totalQuestions = await QuestionModel.countDocuments({
      createdBy: userId,
      ...filters,
    });

    const questions = await QuestionModel.find({
      createdBy: userId,
      ...filters,
    })
      .populate('createdBy', 'personalInfo.name personalInfo.email')
      .populate('subject', 'name')
      .populate('grade', 'name')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalQuestions / limit);

    return {
      questions,
      totalQuestions,
      totalPages,
    };
  } catch (error) {
    throw new Error('Erro ao buscar perguntas: ' + error.message);
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
