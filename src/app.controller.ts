import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  @Render('users')
  async getUsers() {
    const users = await this.appService.getUsers();
    return { users };
  }
}
