import userSchema from '../Schemas/userSchema.js';

const updateUserField = async (
  id,
  section,
  field,
  data,
  ip,
  updateIP = true,
) => {
  try {
    const updateFieldPath = `${section}.${field}`;
    const updateData = {
      [updateFieldPath]: data,
    };

    if (updateIP) {
      updateData[`${section}.updatedAtIP`] = ip || 'N/A';
    }

    await userSchema.updateOne({ _id: id }, { $set: updateData });
  } catch (error) {
    throw new Error('Erro ao atualizar usuário: ' + error.message);
  }
};

const register = async (user, userIp) => {
  try {
    const newUser = await userSchema.create({
      personalInfo: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        CPF: user.CPF,
        birthDate: user.birthDate,
        password: user.password,
        image: user.image,
        gender: user.gender,
        phone: user.phone,
      },
      connectionInfo: {
        createdAtIP: userIp || 'N/A',
      },
    });
    return newUser;
  } catch (error) {
    throw new Error('Erro ao cadastrar usuário: ' + error.message);
  }
};

const getUserDataToLogin = async (email) => {
  console.log(email);
  try {
    const user = await userSchema
      .findOne({ 'personalInfo.email': email })
      .select(
        '-personalInfo.password -__v -connectionInfo.createdAt -connectionInfo.updatedAt -connectionInfo.deletedAt -personalInfo.status -personalInfo.birthDate -connectionInfo.createdAtIP -connectionInfo.updatedAtIP -connectionInfo.deletedAtIP -connectionInfo.lastLoginIP -connectionInfo.lastLoginDate',
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
      .findOne({ 'personalInfo.email': email })
      .select(
        'personalInfo.password personalInfo.email __id personalInfo.role',
      );
    return user;
  } catch (error) {
    throw new Error('Erro ao verificar email: ' + error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await userSchema.find({ 'personalInfo.status': 'active' }); // Busca todos os usuários ativos
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
