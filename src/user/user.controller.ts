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
import User from './domain/user.model';
import * as O from 'fp-ts/Option';
import UserCreationErrors from './domain/errors';
import Email from './domain/email';
import Age from './domain/age';
import EmailException from './domain/errors/email.exception';
import AgeException from './domain/errors/age.exception';
import { left, right } from "fp-ts/Either";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users/:id')
  @Render('find-user')
  async findUser(@Param('id') id: string) {
    const userOrError = await this.userService.findUser(id);

    if (E.isLeft(userOrError)) {
      throw new NotFoundException({
        message: 'Not existing user',
      });
    } else {
      return { user: UserMapper.toPersistence(userOrError.right) };
    }
  }

  @Post('/user')
  async createUser(@Body() request: CreateUserDto) {
    if (isNil(request.email)) {
      throw new BadRequestException('Email is required');
    }
    if (isNil(request.age)) {
      throw new BadRequestException('Age is required');
    }

    const regex = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
    );
    if (!regex.test(request.email)) {
      return left(EmailException.NotAppropriate);
    }

    const email = new Email(request.email);
    if (request.age < 0) {
      return left(AgeException.NotPositive);
    }

    const age = new Age(request.age);

    const user = E.right(
      new User({
        id: request.id,
        name: request.name,
        age: age,
        email: email,
        phone: request.phone,
      }),
    );

    if (E.isLeft(user)) {
      return user;
    }

    const existingUser = await this.userRepository.findUserByEmail(
      user.right.email.value,
    );
    if (O.isSome(existingUser)) {
      return E.left(UserCreationErrors.EmailAlreadyExists);
    }
    const userOrError = await this.userRepository.saveUser(user.right);

    if (E.isLeft(userOrError)) {
      throw new UnprocessableEntityException({
        message: 'User creation error',
        code: userOrError.left,
      });
    } else {
      return { id: userOrError.right.id };
    }
  }
}
