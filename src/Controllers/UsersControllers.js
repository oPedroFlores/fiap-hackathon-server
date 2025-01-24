import UsersModels from '../Models/UsersModels.js';
import {
  validateEssentialFields,
  essentialFieldsAlreadyExists,
  generateToken,
  passwordDecryption,
} from '../Utils/UsersUtils.js';
import { checkMissingRequiredFields } from '../Utils/Utils.js';

const UserRegister = async (req, res) => {
  // * Dados necessários foram enviados?

  const requiredFields = [
    [
      'name',
      'lastName',
      'birthDate',
      'CPF',
      'phone',
      'email',
      'password',
      'gender',
    ],
  ];
  const missingFields = checkMissingRequiredFields(req.body, requiredFields);
  if (!missingFields.success) {
    return res.status(400).json(missingFields);
  }

  // * Verificar dados básicos
  const essentialFields = validateEssentialFields(req.body);
  if (!essentialFields.success) {
    return res.status(400).json(essentialFields);
  }

  // * Algum dos dados essenciais enviados já existe?
  const essentialFieldsExists = await essentialFieldsAlreadyExists(req.body);
  if (!essentialFieldsExists.success) {
    return res.status(400).json(essentialFieldsExists);
  }

  try {
    const user = await UsersModels.register(req.body, req.userIp);
    const token = generateToken(user);
    const userLoginData = await UsersModels.getUserDataToLogin(user.email);
    res.status(201).json({
      user: userLoginData,
      token,
      message: 'Usuário cadastrado com sucesso!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UserLogin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: 'Os campos email e password devem ser preenchidos.',
      success: false,
    });
  }

  try {
    // Pegar email enviado
    const user = await UsersModels.doesEmailExist(req.body.email);

    if (!user) {
      return res.status(400).json({
        error: 'Email não cadastrado.',
        success: false,
      });
    }

    // Comparar senhas
    const password = req.body.password;
    const passwordMatch = passwordDecryption(
      password,
      user.personalInfo.password,
    );

    if (!passwordMatch) {
      return res.status(400).json({
        error: 'Senha incorreta.',
        success: false,
      });
    }

    const token = generateToken(user);
    const userLoginData = await UsersModels.getUserDataToLogin(
      user.personalInfo.email,
    );

    //* Atualizar ultimo Ip de login e last login date
    UsersModels.updateUserField(
      user._id,
      'connectionInfo',
      'lastLoginIP',
      req.userIp || 'N/A',
      req.userIp || 'N/A',
      false,
    );

    UsersModels.updateUserField(
      user._id,
      'connectionInfo',
      'lastLoginDate',
      Date.now(),
      req.userIp || 'N/A',
      false,
    );

    res.status(200).json({
      user: userLoginData,
      token,
      success: true,
      message: 'Usuário logado com sucesso!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

const UserAuth = async (req, res) => {
  const email = req.user.personalInfo.email;

  try {
    const user = await UsersModels.getUserDataToLogin(email);
    const token = generateToken(user);

    //* Atualizar ultimo Ip de login e last login date
    UsersModels.updateUserField(
      user._id,
      'connectionInfo',
      'lastLoginIP',
      req.userIp || 'N/A',
      req.userIp || 'N/A',
      false,
    );
    UsersModels.updateUserField(
      user._id,
      'connectionInfo',
      'lastLoginDate',
      Date.now(),
      req.userIp || 'N/A',
      false,
    );
    res.status(200).json({
      user,
      token,
      success: true,
      message: 'Usuário autenticado com sucesso!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModels.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { UserRegister, getAllUsers, UserLogin, UserAuth };
