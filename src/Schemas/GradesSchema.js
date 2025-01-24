import mongoose from 'mongoose';
import gradesData from './InitialData/grades.json' assert { type: 'json' };

// Definir o schema
const gradesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

// Registrar o modelo
const Grades = mongoose.model('Grades', gradesSchema);

// Função para inicializar os dados
const initializeGrades = async () => {
  try {
    const gradeOperations = gradesData.map((grade) => ({
      updateOne: {
        filter: { name: grade.name },
        // $setOnInsert insere os campos somente se o documento NÃO existir
        update: { $setOnInsert: grade },
        upsert: true,
      },
    }));
    await Grades.bulkWrite(gradeOperations);
    console.log('Grades initialized successfully.');
  } catch (error) {
    console.error('Error initializing grades:', error);
  }
};

initializeGrades();

export { Grades, initializeGrades };
