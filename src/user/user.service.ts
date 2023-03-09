import { Injectable } from '@nestjs/common';
import { Prisma, User as UserInterface } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import UserCreationErrors, { UserFindErrors } from './domain/errors';
import Email from './domain/email';
import { Either } from 'fp-ts/Either';
import User from './domain/user.model';
import UserRepository from './infra/user.repository';
import * as O from 'fp-ts/Option';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
  ) {}

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
  ): Promise<Either<UserCreationErrors, User>> {
    const user = User.create(userDto);
    if (E.isLeft(user)) {
      return user;
    }

    const existingUser = await this.userRepository.findUserByEmail(
      user.right.email.value,
    );
    if (O.isSome(existingUser)) {
      return E.left(UserCreationErrors.EmailAlreadyExists);
    }

    const result = await this.userRepository.saveUser(user.right);
    return E.right(result);
  }
}
