import { Grades } from '../Schemas/GradesSchema.js';

export const thisGradeExists = async (gradeId, userId) => {
  const gradeExists = await Grades.findOne({ _id: gradeId });

  if (gradeExists.createdBy === null) return true;

  if (gradeExists.createdBy.equals(userId)) return true;

  return false;
};

export const gradesNameAlredyExistsForUser = async (
  gradeName,
  userId,
  gradeId,
) => {
  const filter = {
    $or: [{ createdBy: userId }, { default: true }],
    name: gradeName,
  };

  if (gradeId) {
    filter._id = { $ne: gradeId };
  }

  const gradeExists = await Grades.findOne(filter).collation({
    locale: 'pt',
    strength: 1,
  });

  return !!gradeExists;
};

//* Verificar se este subject Id pertence a este userId
export const thisGradeBelongsToThisUser = async (gradeId, userId) => {
  try {
    const grade = await Grades.findOne({
      _id: gradeId,
      default: false,
    }).select('createdBy');
    if (grade) {
      return grade.createdBy.equals(userId);
    }
    return false;
  } catch (error) {
    throw new Error(
      'Erro ao verificar se a turma pertence ao usuário: ' + error.message,
    );
  }
};
