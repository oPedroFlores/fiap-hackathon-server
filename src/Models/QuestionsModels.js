import mongoose from 'mongoose';
import questionSchema from '../Schemas/questionSchema.js';

// Cria o modelo com base no schema
const QuestionModel = mongoose.model('Question', questionSchema);

const createQuestion = async (question, user) => {
  try {
    const newQuestion = await QuestionModel.create({
      ...question,
      accessibility: question.accessibility || false,
      author: user._id,
    });
    return newQuestion;
  } catch (error) {
    throw new Error('Erro ao criar pergunta: ' + error.message);
  }
};

export default { createQuestion };
