import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as E from 'fp-ts/Either';
import { CreateUserDto } from './dto/create-user.dto';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users/:id')
  @Render('find-user')
  async findUser(@Param('id') id: string): Promise<{ user: CreateUserDto }> {
    const userOrError = await this.userService.findUser(id);

    if (E.isLeft(userOrError)) {
      throw new NotFoundException({
        message: 'Not existing user',
      });
    } else {
      return { user: userOrError.right };
    }
  }

  @Post('/user')
  async createUser(@Body() request: CreateUserDto): Promise<{ id: number }> {
    if (isNil(request.email)) {
      throw new BadRequestException('Email is required');
    }
    if (isNil(request.age)) {
      throw new BadRequestException('Age is required');
    }

    const userIdOrError = await this.userService.createUser(request);

    if (E.isRight(userIdOrError)) {
      return { id: userIdOrError.right };
    }

    if (E.isLeft(userIdOrError)) {
      throw new UnprocessableEntityException({
        message: 'User creation error',
        code: userIdOrError.left,
      });
    } else {
      return { id: null };
    }
  }
}
