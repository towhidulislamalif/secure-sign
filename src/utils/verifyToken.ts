import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifytoken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
