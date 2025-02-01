import SubjectsModels from '../Models/SubjectsModels.js';
import {
  subjectNameAlreadyExistsForUser,
  hasRepeatedElements,
  thisSubjectBelongsToThisUser,
  hasRepeatedTopicNames,
  topicsBelongToSubject,
} from '../Utils/SubjectUtils.js';
const getAllSubjects = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const page = parseInt(req.query.page, 10) || 1;
    const subjectsResponse = await SubjectsModels.getAllSubjects(
      req.user._id,
      page,
      limit,
    );

    const { subjects, totalQuestions, totalPages } = subjectsResponse;

    res
      .status(200)
      .json({
        success: true,
        page,
        limit,
        totalPages,
        totalQuestions,
        subjects,
      });
  } catch (error) {
    console.log(`Erro ao buscar materias: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const createSubject = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ success: false, error: 'O campo name deve ser preenchido.' });
  }

  try {
    //* Verificar se este name de subject já existe nos padrões ou nos subjects criados pelo usuário
    const subjectExists = await subjectNameAlreadyExistsForUser(
      req.body.name,
      req.user._id,
    );
    if (subjectExists) {
      return res.status(400).json({
        success: false,
        error: 'Ja existe uma materia com esse nome.',
      });
    }

    //* Verificar se existe algum tópico repetido neste subject
    const sendedTopics = req.body.topics;
    if (hasRepeatedElements(sendedTopics)) {
      return res.status(400).json({
        success: false,
        error: 'Nao pode haver tópicos repetidos neste subject.',
      });
    }

    await SubjectsModels.createSubject(
      {
        name: req.body.name,
        topics: req.body.topics.map((topic) => ({ name: topic })),
      },
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: 'Materia criada com sucesso.',
    });
  } catch (error) {
    console.log(`Erro ao criar materia: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'O id deve ser preenchido.',
    });
  }
  try {
    //* Este subject pertence a este usuário?
    const belongsToUser = await thisSubjectBelongsToThisUser(id, req.user._id);
    if (!belongsToUser) {
      return res.status(400).json({
        success: false,
        error: 'Este subject nao pertence ao usuário.',
      });
    }

    //* O nome enviado já está sendo utilizado ?
    if (req.body.name) {
      const subjectNameExists = await subjectNameAlreadyExistsForUser(
        req.body.name,
        req.user._id,
        id,
      );

      if (subjectNameExists) {
        return res.status(400).json({
          success: false,
          error: 'Ja existe uma materia com esse nome.',
        });
      }
    }

    //* Algum dos topics enviados é repetido ?
    if (req.body.topics) {
      const sendedTopics = req.body.topics;
      if (hasRepeatedTopicNames(sendedTopics)) {
        return res.status(400).json({
          success: false,
          error: 'Nao pode haver tópicos repetidos neste subject.',
        });
      }
    }

    //* Verificar se cada id enviado realmente faz parte do subject
    if (req.body.topics) {
      const topicsBelong = await topicsBelongToSubject(id, req.body.topics);
      if (!topicsBelong) {
        return res.status(400).json({
          success: false,
          error: 'Um ou mais tópicos enviados nao pertencem ao subject.',
        });
      }
    }

    //* Atualizar o subject
    await SubjectsModels.updateSubject(id, req.body);

    return res
      .status(200)
      .json({ success: true, message: 'Materia atualizada com sucesso.' });
  } catch (error) {
    console.log(`Erro ao atualizar materia: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'O id deve ser preenchido.',
    });
  }
  try {
    //* Este subject pertence a este usuário?
    const belongsToUser = await thisSubjectBelongsToThisUser(id, req.user._id);
    if (!belongsToUser) {
      return res.status(400).json({
        success: false,
        error: 'Este subject nao pertence ao usuário.',
      });
    }

    await SubjectsModels.deleteSubject(id);
    return res
      .status(200)
      .json({ success: true, message: 'Materia excluida com sucesso.' });
  } catch (error) {
    console.log(`Erro ao excluir materia: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default { getAllSubjects, createSubject, updateSubject, deleteSubject };
