import { Injectable } from '@nestjs/common';
import { Prisma, User as UserInterface } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import UserCreationErrors, { UserFindErrors } from './domain/errors';
import Email from './domain/email';
import { Either } from 'fp-ts/Either';
import User from './domain/user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: string): Promise<E.Either<UserFindErrors, CreateUserDto>> {
    const data = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        name: true,
        age: true,
        email: true,
        phone: true,
      },
    });

    if (!data) {
      return E.left(UserFindErrors.UserNotFound);
    } else {
      return E.right(data);
    }
  }

  async createUser(
    userDto: CreateUserDto,
  ): Promise<Either<UserCreationErrors, number>> {
    const user = User.create(userDto);
    if (E.isLeft(user)) {
      return user;
    }

    // const existingUser = userRepository.findUserByEmail(user.value.email);
    // if (existingUser) {
    //   return E.left(UserCreationErrors.EmailAlreadyExists);
    // }

    // return userRepository.saveUser(user);
    // TODO: repository pattern 공부하고 적용하기

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
