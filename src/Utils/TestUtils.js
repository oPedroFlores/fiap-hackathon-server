import mongoose from 'mongoose';
import Test from '../Schemas/testSchema.js';

export const thisTestIdBelongsToThisUser = async (testId, userId) => {
  const testExists = await Test.findOne({ _id: testId });

  if (!testExists) return { error: 'Prova não encontrada' };

  if (testExists.createdBy.equals(userId)) return { error: false };

  return { error: 'Prova não pertence ao usuário' };
};
