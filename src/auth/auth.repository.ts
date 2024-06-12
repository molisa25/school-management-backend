import { Service } from 'typedi';
import { User } from '@prisma/client';
import { prismaClient } from '../config/database';
import { SignupDto } from './auth.dto';

@Service()
export default class AuthRepository {
  constructor() {}

  async create_user(payload: SignupDto): Promise<User> {
    return await prismaClient.user.create({
      data: {
        ...payload,
      },
    });
  }

  async fetch_user(email: string): Promise<User | null> {
    return await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
}
