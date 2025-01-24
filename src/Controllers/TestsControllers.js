import TestsModels from '../Models/TestsModels.js';
import UsersModels from '../Models/UsersModels.js';

const testController = {
  createTest: async (req, res) => {
    try {
      const { ...testData } = req.body;

      const professor = await UsersModels.findById(testData.professor);
      if (!professor) {
        return res.status(400).json({ message: 'Professor não encontrado.' });
      }

      const newTest = await TestsModels.create(testData);

      res.status(201).json(newTest);
    } catch (error) {
      console.error("Erro ao criar prova:", error);
      res.status(500).json({ message: 'Erro ao criar prova.', error: error.message });
    }
  },

  getTestById: async (req, res) => {
    try {
      const test = await TestsModels.findById(req.params.id)
        .populate('questions')
        .populate('professor');
      if (!test) {
        return res.status(404).json({ message: 'Prova não encontrada.' });
      }
      res.json(test);
    } catch (error) {
      console.error("Erro ao buscar prova:", error);
      res.status(500).json({ message: 'Erro ao buscar prova.', error: error.message });
    }
  },

  getAllActiveTests: async (req, res) => {
    try {
      const tests = await TestsModels.find({ status: 'active' }).populate('professor');
      res.json(tests);
    } catch (error) {
      console.error("Erro ao buscar provas ativas:", error);
      res.status(500).json({ message: 'Erro ao buscar provas ativas.', error: error.message });
    }
  },

  getTestsByProfessor: async (req, res) => {
    try {
      const tests = await TestsModels.find({ professor: req.params.professorId }).populate('professor');
      res.json(tests);
    } catch (error) {
      console.error("Erro ao buscar provas por professor:", error);
      res.status(500).json({ message: 'Erro ao buscar provas por professor.', error: error.message });
    }
  },

  updateTest: async (req, res) => {
    try {
      const updatedTest = await TestsModels.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedTest) {
        return res.status(404).json({ message: 'Prova não encontrada.' });
      }
      res.json(updatedTest);
    } catch (error) {
      console.error("Erro ao atualizar prova:", error);
      res.status(500).json({ message: 'Erro ao atualizar prova.', error: error.message });
    }
  },

  // Deletar uma prova
  deleteTest: async (req, res) => {
    try {
      const deletedTest = await TestsModels.findByIdAndDelete(req.params.id);
      if (!deletedTest) {
        return res.status(404).json({ message: 'Prova não encontrada.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar prova:", error);
      res.status(500).json({ message: 'Erro ao deletar prova.', error: error.message });
    }
  },
};

export default testController;