import { verifyToken } from '../Utils/UsersUtils.js';
import userSchema from '../Schemas/userSchema.js';

const authenticate = async (req, res, next) => {
  // Pega o token do cabeçalho Authorization (Bearer token)
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token não fornecido', success: false });
  }

  try {
    const decoded = verifyToken(token);

    const user = await userSchema.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Usuário não encontrado', success: false });
    }

    // Anexa o usuário ao request para as próximas rotas
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Token inválido ou expirado', success: false });
  }
};

export default {
  authenticate,
};
