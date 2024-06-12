import { Service } from 'typedi';
import AuthRepository from './auth.repository';
import { IAuth } from './auth.interface';
import { LoginDto, SignupDto } from './auth.dto';
import * as AuthenticationUtils from '../utils/authentication.utils';
import {IUser} from "../user/user.interface";

@Service()
export default class AuthService {
  constructor(private authRepo: AuthRepository) {}

  async login(payload: LoginDto): Promise<IAuth> {
    const user = await this.authRepo.fetch_user(payload.email);

    if (!user) {
      throw new Error('User does not exist');
    }

    const validPassword = await AuthenticationUtils.validatePassword(
      payload.password,
      user.password,
    );

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const accessToken = AuthenticationUtils.generateAccessToken({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      token: accessToken,
    };
  }

  async signUp(payload: SignupDto): Promise<IAuth> {
    // check if there is an account with this email
    const existingEmail = await this.authRepo.fetch_user(payload.email);
    if (existingEmail) {
      throw new Error('Email address already exists');
    }

    // check password length
    if (payload.password.length < 8) {
      throw new Error(
        'Password is too short. At least 8 characters are required.',
      );
    }

    // hash the password
    const hashedPassword = await AuthenticationUtils.hashString(
      payload.password,
    );

    // create user in db
    const createdUser = await this.authRepo.create_user({
      ...payload,
      password: hashedPassword,
    });

    if (!createdUser) {
      throw new Error(
        'There was an unexpected issue creating your account, please try again.',
      );
    }

    // generate access token
    const accessToken = AuthenticationUtils.generateAccessToken({
      id: createdUser.id,
      first_name: createdUser.firstName,
      last_name: createdUser.lastName,
      email: createdUser.email,
      role: createdUser.role,
    });

    return {
      id: createdUser.id,
      first_name: createdUser.firstName,
      last_name: createdUser.lastName,
      email: createdUser.email,
      token: accessToken,
    };
  }
}
