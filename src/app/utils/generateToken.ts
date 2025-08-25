import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../../config';

export const generateToken = {
  generateAccessToken: (payload: object) => {
    return jwt.sign(payload, config.jwt.access_secret, {
      expiresIn: config.jwt.access_expires_in,
    } as SignOptions);
  },

  generateRefreshToken: (payload: object) => {
    return jwt.sign(payload, config.jwt.refresh_secret, {
      expiresIn: config.jwt.refresh_expires_in,
    } as SignOptions);
  },

  generatePasswordResetToken: (payload: object) => {
    return jwt.sign(payload, config.jwt.access_secret, {
      expiresIn: '1h',
    } as SignOptions);
  },

  verifyToken: (token: string, secret: Secret) => {
    return jwt.verify(token, secret);
  },
};
