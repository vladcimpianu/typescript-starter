import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserLogin, UserRegister } from './types';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async login(userLogin: UserLogin): Promise<boolean> {
    if (userLogin.password) {
      userLogin.password = await bcrypt.hash(userLogin.password, SALT_ROUNDS);
    }
    const foundUser = await this.prismaService.user.findFirst({
      where: { username: userLogin.username, password: userLogin.password },
    });

    if (!foundUser) {
      throw new Error('User does not exist!');
    }

    const credentialsMatch =
      foundUser.username === userLogin.username &&
      foundUser.password === userLogin.password;
    if (!credentialsMatch) {
      foundUser.isLoggedIn = true;
    }

    if (credentialsMatch) {
      return true;
    } else {
      throw new Error('Incorrect credentials!');
    }
  }

  async register(data: UserRegister): Promise<User> {
    try {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
      const user = await this.prismaService.user.create({ data });
      return user;
    } catch (_err) {
      throw new Error('User could not be created');
    }
  }
}
