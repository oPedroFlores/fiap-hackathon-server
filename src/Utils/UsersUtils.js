import userSchema from '../Schemas/userSchema.js';
import { returnMessage } from './Utils.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const CPFValidator = (cpf) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!regex.test(cpf)) {
    return returnMessage(
      'CPF',
      'invalid',
      'O campo CPF precisa estar no formato 000.000.000-00.',
    );
  }
  return returnMessage('CPF', null, 'CPF válido.', true);
};

export const emailValidator = (email) => {
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    return returnMessage(
      'email',
      'invalid',
      'O campo email deve ser um endereço de email válido.',
    );
  }
  return returnMessage('email', null, 'Email válido.', true);
};

export const emailAlreadyExists = async (email) => {
  const user = await userSchema.findOne({ email: email });
  if (user) {
    return returnMessage(
      'email',
      'alreadyExists',
      'O email informado já está registrado.',
    );
  }
  return returnMessage('email', null, 'Email disponível.', true);
};

export const phoneValidator = (phone) => {
  const regex = /^\(?\d{2}\)?\s?(9?\d{4})-?\d{4}$/;
  if (!regex.test(phone)) {
    return returnMessage(
      'phone',
      'invalid',
      'O campo telefone precisa estar no formato brasileiro (ex: (11) 91234-5678).',
    );
  }
  return returnMessage('phone', null, 'Telefone válido.', true);
};

export const CPFAlreadyExists = async (CPF) => {
  const user = await userSchema.findOne({ CPF: CPF });
  if (user) {
    return returnMessage(
      'CPF',
      'alreadyExists',
      'O CPF informado já está registrado.',
    );
  }
  return returnMessage('CPF', null, 'CPF disponível.', true);
};

export const phoneAlreadyExists = async (phone) => {
  const user = await userSchema.findOne({ phone: phone });
  if (user) {
    return returnMessage(
      'phone',
      'alreadyExists',
      'O telefone informado já está registrado.',
    );
  }
  return returnMessage('phone', null, 'Telefone disponível.', true);
};

export const validateNameAndLastName = (name, lastName) => {
  const regex = /^[A-Za-z\s]+$/;
  if (!regex.test(name) || name.length <= 3) {
    return returnMessage(
      'name',
      'invalid',
      'O campo nome precisa ter pelo menos 3 caracteres e conter apenas letras.',
    );
  }
  if (!regex.test(lastName) || lastName.length <= 3) {
    return returnMessage(
      'lastName',
      'invalid',
      'O campo sobrenome precisa ter pelo menos 3 caracteres e conter apenas letras.',
    );
  }
  return returnMessage('nameLastName', null, 'Nome e sobrenome válidos.', true);
};

export const validateEssentialFields = (data) => {
  const { phone, CPF, email, name, lastName } = data;

  const errors = [];

  const phoneValidation = phoneValidator(phone);
  if (!phoneValidation.success) errors.push(phoneValidation);

  const CPFValidation = CPFValidator(CPF);
  if (!CPFValidation.success) errors.push(CPFValidation);

  const emailValidation = emailValidator(email);
  if (!emailValidation.success) errors.push(emailValidation);

  const nameValidation = validateNameAndLastName(name, lastName);
  if (!nameValidation.success) errors.push(nameValidation);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, message: 'Todos os campos são válidos.' };
};

export const essentialFieldsAlreadyExists = async (data) => {
  const { phone, CPF, email } = data;

  const errors = [];

  const phoneValidation = await phoneAlreadyExists(phone);
  if (!phoneValidation.success) errors.push(phoneValidation);

  const CPFValidation = await CPFAlreadyExists(CPF);
  if (!CPFValidation.success) errors.push(CPFValidation);

  const emailValidation = await emailAlreadyExists(email);
  if (!emailValidation.success) errors.push(emailValidation);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, message: 'Todos os campos são válidos.' };
};

export const checkMissingRequiredFields = (data) => {
  const clientRequiredFields = [
    'name',
    'lastName',
    'birthDate',
    'CPF',
    'phone',
    'email',
    'password',
    'gender',
  ];

  const missingFields = clientRequiredFields.filter((field) => {
    return (
      data[field] === undefined || data[field] === null || data[field] === ''
    );
  });

  if (missingFields.length > 0) {
    return {
      success: false,
      errors: `Os campos ${missingFields} são obrigatórios.`,
    };
  }

  return {
    success: true,
    message: 'Todos os campos obrigatórios estão presentes.',
  };
};

export const passwordEncryption = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const passwordDecryption = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

export const generateToken = (user) => {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  return token;
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);
  return decoded;
};
