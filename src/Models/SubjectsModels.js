import { Subject } from '../Schemas/subjectsSchema.js';

const getAllSubjects = async (userId, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const totalQuestions = await Subject.countDocuments({
      createdBy: userId,
    });

    const subjects = await Subject.find({
      $or: [
        { default: true }, // Busca pelos subjects padrão
        { createdBy: userId }, // Busca pelos subjects criados pelo usuário
      ],
    })
      .select('name default _id topics')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalQuestions / limit);

    return { subjects, totalQuestions, totalPages };
  } catch (error) {
    throw new Error('Erro ao pegar materias: ' + error.message);
  }
};

const createSubject = async (subject, userId) => {
  try {
    const newSubject = await Subject.create({ ...subject, createdBy: userId }); // Cria um novo subject
    return newSubject;
  } catch (error) {
    throw new Error('Erro ao criar materia: ' + error.message);
  }
};

const getSubjectInfoByName = async (name, userId) => {
  try {
    const subject = await Subject.findOne({
      name,
      $or: [
        { createdBy: userId }, // Verifica se o subject foi criado pelo usuário
        { default: true }, // Ou se é um subject padrão
      ],
    });
    return subject;
  } catch (error) {
    throw new Error('Erro ao pegar materia: ' + error.message);
  }
};

const getSubjectInfoById = async (id) => {
  try {
    const subject = await Subject.findById(id);
    return subject;
  } catch (error) {
    throw new Error('Erro ao pegar materia: ' + error.message);
  }
};

const updateSubject = async (id, subject) => {
  try {
    //* Itera sobre os tópicos enviados
    for (const topic of subject.topics) {
      const { _id, name } = topic;

      //* Atualiza o tópico específico dentro do array 'topics'
      await Subject.updateOne(
        { _id: id, 'topics._id': _id }, // Localiza o subject e o tópico pelo ID
        { $set: { 'topics.$.name': name } }, // Atualiza o nome do tópico
      );
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name: subject.name },
      { new: true },
    );

    return updatedSubject;
  } catch (error) {
    throw new Error('Erro ao atualizar materia: ' + error.message);
  }
};

const deleteSubject = async (id) => {
  try {
    await Subject.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Erro ao excluir materia: ' + error.message);
  }
};

export default {
  getAllSubjects,
  createSubject,
  getSubjectInfoByName,
  getSubjectInfoById,
  updateSubject,
  deleteSubject,
};
