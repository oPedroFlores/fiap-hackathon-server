import { Grades } from '../Schemas/GradesSchema.js';

const getAllGrades = async (userId) => {
  try {
    const grades = await Grades.find({
      $or: [
        { default: true }, // Busca pelos subjects padrão
        { createdBy: userId }, // Busca pelos subjects criados pelo usuário
      ],
    }).select('name default _id');

    return grades;
  } catch (error) {
    throw new Error('Erro ao pegar turmas: ' + error.message);
  }
};

const createGrade = async (grade, userId) => {
  try {
    const newGrade = await Grades.create({ name: grade, createdBy: userId }); // Cria um novo subject
    return newGrade;
  } catch (error) {
    throw new Error('Erro ao criar turma: ' + error.message);
  }
};

const updateGrade = async (id, name) => {
  try {
    const updatedGrade = await Grades.findOneAndUpdate(
      { _id: id },
      { name: name },
      { new: true },
    );
    return updatedGrade;
  } catch (error) {
    throw new Error('Erro ao atualizar turma: ' + error.message);
  }
};

const deleteGrade = async (id) => {
  try {
    const deletedGrade = await Grades.findOneAndDelete({ _id: id });
    return deletedGrade;
  } catch (error) {
    throw new Error('Erro ao excluir turma: ' + error.message);
  }
};

export default { getAllGrades, createGrade, updateGrade, deleteGrade };
