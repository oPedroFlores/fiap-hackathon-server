import mongoose from 'mongoose';
import subjectsData from './InitialData/subjects.json' assert { type: 'json' }; // JSON para as grades

const subjectsSchema = new mongoose.Schema({
  name: {
    // "enunciado"
    type: String,
    required: true,
    unique: true,
  },
  topics: [
    {
      name: {
        type: String,
        required: true,
        validate: {
          validator: function (topicName) {
            const topicNames = this.topics.map((topic) => topic.name);
            const occurrences = topicNames.filter(
              (name) => name === topicName,
            ).length;
            return occurrences === 1; // Garante que o nome aparece apenas uma vez
          },
          message: (props) =>
            `O tópico "${props.value}" já existe neste subject!`,
        },
      },
    },
  ],
});

const Subject = mongoose.model('Subject', subjectsSchema);

// Função para inicializar os dados
const initilizaeSubjects = async () => {
  try {
    const subjectOperations = subjectsData.map((subject) => ({
      updateOne: {
        filter: { name: subject.name },
        update: { $setOnInsert: subject },
        upsert: true,
      },
    }));
    await Subject.bulkWrite(subjectOperations);
    console.log('Subjects initialized successfully.');
  } catch (error) {
    console.error('Error initializing subjects:', error);
  }
};

initilizaeSubjects();

export { Subject, initilizaeSubjects };
