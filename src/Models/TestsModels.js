import mongoose from 'mongoose';

const Test = mongoose.model('Test', testSchema);

const updateTestField = async (id, field, data, updateIP = true) => {
  try {
    const updateData = {
      [field]: data,
    };

    if (updateIP) {
      updateData.updatedAtIP = req.userIp || 'N/A';
    }

    await Test.updateOne({ _id: id }, updateData);
  } catch (error) {
    throw new Error('Erro ao atualizar prova: ' + error.message);
  }
};

const createTest = async (testData, user) => {
  try {
    if (user) {
      testData.professor = user._id;
    }
    const newTest = await Test.create(testData);
    return newTest;
  } catch (error) {
    throw new Error('Erro ao criar prova: ' + error.message);
  }
};

const getTestById = async (id) => {
  try {
    const test = await Test.findById(id)
      .populate('questions')
      .populate('professor');
    if (!test) {
      throw new Error('Prova não encontrada.');
    }
    return test;
  } catch (error) {
    throw new Error('Erro ao buscar prova: ' + error.message);
  }
};

const getAllActiveTests = async () => {
  try {
    const tests = await Test.find({ status: 'active' });
    return tests;
  } catch (error) {
    throw new Error('Erro ao buscar provas ativas: ' + error.message);
  }
};

const getTestsByProfessor = async (professorId) => {
  try {
    const tests = await Test.find({ professor: professorId });
    return tests;
  } catch (error) {
    throw new Error('Erro ao buscar provas por professor: ' + error.message);
  }
};

const getTestsByStudentGrade = async (grade) => {
  try {
    const tests = await Test.find({ grade });
    return tests;
  } catch (error) {
    throw new Error('Erro ao buscar provas por turma: ' + error.message);
  }
};

export default {
  updateTestField,
  createTest,
  getTestById,
  getAllActiveTests,
  getTestsByProfessor,
  getTestsByStudentGrade,
};