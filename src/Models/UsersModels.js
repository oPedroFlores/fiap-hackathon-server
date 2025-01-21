import userSchema from '../Schemas/userSchema.js';

const updateUserField = async (id, field, data, ip, updateIP = true) => {
  try {
    const updateData = {
      [field]: data,
    };

    if (updateIP) {
      updateData.updatedAtIP = req.userIp || 'N/A';
    }

    await userSchema.updateOne({ _id: id }, updateData);
  } catch (error) {
    throw new Error('Erro ao atualizar usuário: ' + error.message);
  }
};

const register = async (user, userIp) => {
  try {
    const newUser = await userSchema.create({
      ...user,
      createdAtIP: userIp || 'N/A',
    });
    return newUser;
  } catch (error) {
    throw new Error('Erro ao cadastrar usuário: ' + error.message);
  }
};

const getUserDataToLogin = async (email) => {
  try {
    const user = await userSchema
      .findOne({ email })
      .select(
        '-password -__v -createdAt -updatedAt -deletedAt -status -CPF -birthDate -createdAtIP -updatedAtIP -deletedAtIP -lastLoginIP -lastLoginDate',
      );
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  } catch (error) {
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
};

const doesEmailExist = async (email) => {
  try {
    const user = await userSchema
      .findOne({ email })
      .select('password email __id role');
    return user;
  } catch (error) {
    throw new Error('Erro ao verificar email: ' + error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await userSchema.find({ status: 'active' }); // Busca todos os usuários ativos
    return users;
  } catch (error) {
    throw new Error('Erro ao buscar usuários ativos: ' + error.message);
  }
};

// Exporta as funções como um objeto
export default {
  register,
  getAllUsers,
  getUserDataToLogin,
  doesEmailExist,
  updateUserField,
};
