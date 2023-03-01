import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Prisma, User as UserInterface } from '@prisma/client';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { PrismaService } from 'src/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import UserCreationErrors from './domain/errors';
import Email from './domain/email';
import { Either } from 'fp-ts/Either';
import User from './domain/user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: string): Promise<O.Option<User>> {
    const data = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (data) {
      return O.some(data);
    }

    return O.none;
  }

  async createUser(
    userDto: CreateUserDto,
  ): Promise<Either<UserCreationErrors, number>> {
    const user = User.create(userDto);
    if (E.isLeft(user)) {
      return user;
    }

    const existingUser = userRepository.findUserByEmail(user.value.email);
    if (existingUser) {
      return E.left(UserCreationErrors.EmailAlreadyExists);
    }

    return userRepository.saveUser(user);

    // try {
    //   const data = await this.prisma.user.create({
    //     data: user,
    //     select: {
    //       id: true,
    //     },
    //   });
    //
    //   if (data) {
    //     return O.some(data.id);
    //   }
    //
    //   return O.none;
    // } catch (e) {
    //   if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //     if (e.code === UserCreationErrors.EmailAlreadyExists) {
    //       throw new UnprocessableEntityException('Email is already taken');
    //     }
    //   }
    // }
  }
}
