import mongoose from 'mongoose';
import testSchema from '../Schemas/testSchema';
const testModel = mongoose.model('Test', testSchema);

export const thisTestIdBelongsToThisUser = async (testId, userId) => {
  const testExists = await questionModel.findOne({ _id: testId });

  if (!testExists) return { error: 'Prova não encontrada' };

  if (testExists.createdBy.equals(userId)) return { error: false };

  return { error: 'Prova não pertence ao usuário' };
};

