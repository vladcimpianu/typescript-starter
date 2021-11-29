import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async login(id: number, password: string): Promise<boolean> {
    const foundUser = await this.prisma.user.findFirst({
      where: { id, password },
    });

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const credentialsMatch =
      foundUser.id === id && foundUser.password === password;
    if (!credentialsMatch) {
      foundUser.isLoggedIn = true;
    }

    return credentialsMatch;
  }

  async register(data: User): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });

    if (!user.id) {
      throw new Error('User could not be created');
    }

    return user;
  }
}
