import rateLimit from 'express-rate-limit';

export const captureIp = (req, res, next) => {
  req.userIp =
    req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
};

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10000,
  message: 'Muitas requisições, tente novamente mais tarde.',
});
