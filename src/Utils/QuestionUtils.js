import mongoose from 'mongoose';
import questionSchema from '../Schemas/questionSchema.js';
const questionModel = mongoose.model('Question', questionSchema);

export const thisQuestionIdBelongsToThisUser = async (questionId, userId) => {
  const questionExists = await questionModel.findOne({ _id: questionId });

  if (!questionExists) return { error: 'Pergunta não encontrada' };

  if (questionExists.createdBy.equals(userId)) return { error: false };

  return { error: 'Pergunta não pertence ao usuário' };
};

export const thisQuestionIdBelongsToThisUserOrIsPublic = async (
  questionId,
  userId,
) => {
  const questionExists = await questionModel.findOne({ _id: questionId });

  if (!questionExists) return { error: 'Pergunta não encontrada' };

  if (questionExists.createdBy.equals(userId) || questionExists.isPublic)
    return { error: false };

  return { error: 'Pergunta não pertence ao usuário' };
};
