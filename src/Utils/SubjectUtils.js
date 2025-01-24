import { Subject } from '../Schemas/subjectsSchema.js';

export const thisSubjectExists = async (subject) => {
  const subjectExists = await Subject.findOne({ name: subject });
  return !!subjectExists;
};

export const thisTopicExists = async (subject, topic) => {
  const subjectExists = await Subject.findOne({ name: subject });
  if (subjectExists) {
    const topicExists = subjectExists.topics.find((t) => t.name === topic);
    return !!topicExists;
  }
  return false;
};

//* Verificar se tem 4 alternativas para a questão
export const hasFourAlternatives = (alternatives) => {
  return alternatives.length === 4;
};

//* Verificar se a dificuldade está dentro do padrão
export const isValidDifficulty = (difficulty) => {
  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];
  return difficulties.includes(difficulty);
};
