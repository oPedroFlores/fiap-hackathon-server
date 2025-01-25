import mongoose from 'mongoose';
import questionSchema from '../Schemas/questionSchema.js';

// Cria o modelo com base no schema
const QuestionModel = mongoose.model('Question', questionSchema);
const getQuestionsModel = new mongoose.Schema({
  statement: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
      author: user._id,
    });
    return newQuestion;
  } catch (error) {
    throw new Error('Erro ao criar pergunta: ' + error.message);
  }
};

const getAllQuestions = async (userId) => {
  try {
    const questions = await QuestionModel.find({ author: userId })
      .populate('author', 'personalInfo.name personalInfo.email')
      .populate('subject', 'name')
      .populate('grade', 'name');

    return questions;
  } catch (error) {
    throw new Error('Erro ao buscar perguntas: ' + error.message);
  }
};

export default { createQuestion, getAllQuestions };
