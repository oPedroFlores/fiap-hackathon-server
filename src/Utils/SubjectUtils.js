import { Subject } from '../Schemas/subjectsSchema.js';

export const thisSubjectExists = async (subject, userId) => {
  if (!subject || !userId) return false;
  const subjectExists = await Subject.findOne({
    _id: subject,
  });

  if (subjectExists.createdBy === null) return true;

  if (subjectExists.createdBy.equals(userId)) return true;

  return false;
};

export const subjectNameAlreadyExistsForUser = async (
  subjectName,
  userId,
  subjectId,
) => {
  try {
    const filter = {
      $or: [{ createdBy: userId }, { default: true }],
      name: subjectName,
    };

    if (subjectId) {
      filter._id = { $ne: subjectId };
    }

    const subjectExists = await Subject.findOne(filter).collation({
      locale: 'pt',
      strength: 1,
    });

    return !!subjectExists;
  } catch (error) {
    throw new Error(
      'Erro ao verificar se o nome do subject já existe: ' + error.message,
    );
  }
};

export const topicNameAlreadyExistsForSubject = async (subjectId, topic) => {
  try {
    const subjectExists = await Subject.findOne({ _id: subjectId });
    if (subjectExists) {
      const topicExists = subjectExists.topics.find((t) => t.name === topic);
      return !!topicExists;
    }
    return false;
  } catch (error) {
    throw new Error(
      'Erro ao verificar se o tópico já existe: ' + error.message,
    );
  }
};

export const thisTopicExists = async (subjectId, topic) => {
  try {
    const subjectExists = await Subject.findOne({ _id: subjectId });
    if (subjectExists) {
      const topicExists = subjectExists.topics.find((t) => t.name === topic);
      return !!topicExists;
    }
    return false;
  } catch (error) {
    throw new Error(
      'Erro ao verificar se o tópico já existe: ' + error.message,
    );
  }
};

//* Verificar se este subject Id pertence a este userId
export const thisSubjectBelongsToThisUser = async (subjectId, userId) => {
  try {
    const subject = await Subject.findOne({
      _id: subjectId,
      default: false,
    }).select('createdBy');
    if (subject) {
      return subject.createdBy.equals(userId);
    }
    return false;
  } catch (error) {
    throw new Error(
      'Erro ao verificar se o subject pertence ao usuário: ' + error.message,
    );
  }
};

//* Verificar se, dentro de uma array, possui algum elemento repetido
export const hasRepeatedElements = (array) => {
  // Normalizar os elementos para ignorar acentuação e case sensitivity
  const normalizedArray = array.map((item) =>
    item
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
  );

  // Verificar se há repetidos
  return new Set(normalizedArray).size !== array.length;
};

//* Verificar se nos objetos de topics enviados, tem algum name repetido
export const hasRepeatedTopicNames = (topics) => {
  const normalizedNames = topics.map((topic) =>
    topic.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentuação
      .toLowerCase(),
  );

  return new Set(normalizedNames).size !== topics.length;
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

//* Verificar se cada id de topic enviado realmente faz parte do subject
export const topicsBelongToSubject = async (subjectId, topics) => {
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new Error('Subject not found.');
    }
    return topics.every((topic) =>
      subject.topics.some((t) => t._id.equals(topic._id)),
    );
  } catch (error) {
    throw new Error(
      'Error checking if topics belong to subject: ' + error.message,
    );
  }
};
