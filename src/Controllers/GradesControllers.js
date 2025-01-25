import GradesModels from '../Models/GradesModels.js';

import {
  gradesNameAlredyExistsForUser,
  thisGradeBelongsToThisUser,
} from '../Utils/GradeUtils.js';

const getAllGrades = async (req, res) => {
  try {
    const grades = await GradesModels.getAllGrades(req.user._id);
    res.status(200).json({ success: true, grades });
  } catch (error) {
    console.log(`Erro ao buscar turmas: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const createGrade = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ success: false, error: 'O campo name deve ser preenchido.' });
  }
  try {
    //* Verificar se já existe grade com este nome para este usuário
    const gradeNameExists = await gradesNameAlredyExistsForUser(
      req.body.name,
      req.user._id,
    );
    if (gradeNameExists) {
      return res.status(400).json({
        success: false,
        error: 'Ja existe uma turma com esse nome.',
      });
    }

    //* Criar nova grade
    await GradesModels.createGrade(req.body.name, req.user._id);
    res
      .status(201)
      .json({ success: true, message: 'Turma criada com sucesso.' });
  } catch (error) {
    console.log(`Erro ao criar turma: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateGrade = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'O id deve ser preenchido.',
    });
  }
  try {
    //* Este subject pertence a este usuário?
    const belongsToUser = await thisGradeBelongsToThisUser(id, req.user._id);
    if (!belongsToUser) {
      return res.status(400).json({
        success: false,
        error: 'Esta turma nao pertence ao usuário.',
      });
    }

    if (!req.body.name) {
      return res
        .status(400)
        .json({ success: false, error: 'O campo name deve ser preenchido.' });
    }

    //* Verificar se este nome já existe
    const gradeNameExists = await gradesNameAlredyExistsForUser(
      req.body.name,
      req.user._id,
      id,
    );
    if (gradeNameExists) {
      return res.status(400).json({
        success: false,
        error: 'Ja existe uma turma com esse nome.',
      });
    }

    await GradesModels.updateGrade(id, req.body.name);

    res
      .status(200)
      .json({ success: true, message: 'Turma atualizada com sucesso.' });
  } catch (error) {
    console.log(`Erro ao atualizar turma: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteGrade = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'O id deve ser preenchido.',
    });
  }
  try {
    //* Este subject pertence a este hete?
    const belongsToUser = await thisGradeBelongsToThisUser(id, req.user._id);
    if (!belongsToUser) {
      return res.status(400).json({
        success: false,
        error: 'Esta turma nao pertence ao hete.',
      });
    }

    await GradesModels.deleteGrade(id);
    res
      .status(200)
      .json({ success: true, message: 'Turma excluida com sucesso.' });
  } catch (error) {
    console.log(`Erro ao excluir turma: ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default { getAllGrades, createGrade, updateGrade, deleteGrade };
