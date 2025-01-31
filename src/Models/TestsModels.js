import mongoose from 'mongoose';

const Test = mongoose.model('Test', testSchema);

const createTest = async (testData, user) => {
  try {

    const newTest = await Test.create({
      ...testData,
      subject: testData.subjectId,
      topic: testData.topic,
      grade: testData.gradeId,
      accessibility: testData.accessibility || false,
      createdBy: user._id,
    });
    return newTest;
  } catch (error) {
    throw new Error('Erro ao criar prova: ' + error.message);
  }
};

const updateTest = async (id, test) => {
    try {
      await Test.findByIdAndUpdate(
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
    const test = await Test.findById(id)
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

    const totalTests = await Test.countDocuments({
      createdBy: userId,
    });

    const tests = await Test.find({ createdBy: userId })
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
      await Test.findByIdAndDelete(id);
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