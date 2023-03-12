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
import { UserMapper } from './domain/user.mapper';
import { User as UserDao } from '@prisma/client';
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users/:id')
  @Render('find-user')
  async findUser(@Param('id') id: string): Promise<{ user: UserDao }> {
    const userOrError = await this.userService.findUser(id);

    if (E.isLeft(userOrError)) {
      throw new NotFoundException({
        message: 'Not existing user',
      });
    } else {
      return { user: UserMapper.toPrisma(userOrError.right) };
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

    const userOrError = await this.userService.createUser(request);

    if (E.isLeft(userOrError)) {
      throw new UnprocessableEntityException({
        message: 'User creation error',
        code: userOrError.left,
      });
    } else {
      return { id: null };
      //TODO: return the created user id
    }
  }
}
