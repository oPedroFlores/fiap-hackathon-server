import testSchema from '../Schemas/testSchema.js';

const createTest = async (testData, user) => {
  console.log('User: ', user);
  try {
    const newTest = await testSchema.create({
      ...testData,
      subject: testData.subjectId,
      topic: testData.topic,
      grade: testData.gradeId,
      accessibility: testData.accessibility || false,
      createdBy: user,
      status: 'Aguardando',
    });
    return newTest;
  } catch (error) {
    throw new Error('Erro ao criar prova: ' + error.message);
  }
};

const updateTest = async (id, test) => {
  try {
    await testSchema.findByIdAndUpdate(
      id,
      {
        ...test,
        subject: test.subjectId,
        grade: test.gradeId,
        difficulty: capitalize(test.difficulty),
      },
      { new: true },
    );
  } catch (error) {
    throw new Error('Erro ao atualizar prova: ' + error.message);
  }
};

const getTestById = async (id) => {
  try {
    const test = await testSchema
      .findById(id)
      .populate('questions')
      .populate('subject', 'name')
      .populate('grade', 'name');
    if (!test) {
      throw new Error('Prova não encontrada.');
    }
    return test;
  } catch (error) {
    throw new Error('Erro ao buscar prova: ' + error.message);
  }
};

const getAllTests = async (userId, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const totalTests = await testSchema.countDocuments({
      createdBy: userId,
    });

    const tests = await testSchema
      .find({ createdBy: userId })
      .populate('questions')
      .populate('createdBy', 'personalInfo.name personalInfo.email')
      .populate('subject', 'name')
      .populate('grade', 'name')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalTests / limit);

    return {
      tests,
      totalTests,
      totalPages,
    };
  } catch (error) {
    throw new Error('Erro ao buscar provas: ' + error.message);
  }
};

const deleteTest = async (id) => {
  try {
    await testSchema.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Erro ao deletar prova: ' + error.message);
  }
};

export default {
  updateTest,
  createTest,
  getTestById,
  getAllTests,
  deleteTest,
};
