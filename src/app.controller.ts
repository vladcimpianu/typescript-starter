import { User } from '.prisma/client';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UserLogin } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/login')
  async login(@Req() req: UserLogin): Promise<boolean> {
    return await this.appService.login(req.id, req.password);
  }

  @Post('/register')
  async register(@Body() data: User): Promise<User> {
    return await this.appService.register(data);
  }
}
