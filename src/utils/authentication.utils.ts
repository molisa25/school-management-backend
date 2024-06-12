import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import env from '../config/env';

export const hashString = async (str: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(str, saltRounds);
};

export const validatePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash.toString(), (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const generateAccessToken = (payload: IUser) => {
  return jwt.sign(payload, env.jwt_secret as string, { expiresIn: 60 * 60 });
};
