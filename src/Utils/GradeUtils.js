import { Grades } from '../Schemas/GradesSchema.js';

export const thisGradeExists = async (grade) => {
  const gradeExists = await Grades.findOne({ name: grade });
  return !!gradeExists;
};
