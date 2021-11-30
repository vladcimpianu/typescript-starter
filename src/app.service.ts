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

  async login({ username, password }: UserLogin): Promise<boolean> {
    const dbUser = await this.prismaService.user.findFirst({
      where: { username },
    });
    if (!dbUser) {
      throw new Error('User does not exist!');
    }

    const isPasswordMatching = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatching) {
      throw new Error('Incorrect credentials!');
    }
    return isPasswordMatching;
  }

  async register({
    password: inputPassword,
    ...data
  }: UserRegister): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(inputPassword, SALT_ROUNDS);
      const user = await this.prismaService.user.create({
        data: { password: hashedPassword, ...data },
      });
      return user;
    } catch (_err) {
      throw new Error('User could not be created');
    }
  }
}
