import { Injectable } from '@nestjs/common';
import { Prisma, User as UserInterface } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import UserCreationErrors, { UserFindErrors } from './domain/errors';
import Email from './domain/email';
import { Either } from 'fp-ts/Either';
import User from './domain/user.model';
import UserRepository from './infra/user.repository';
import * as O from 'fp-ts/Option';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async findUser(id: string): Promise<E.Either<UserFindErrors, User>> {
    const data = await this.userRepository.findUserById(Number(id));

    if (O.isNone(data)) {
      return E.left(UserFindErrors.UserNotFound);
    } else {
      return E.right(data.value);
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
    result.accessToken = this.authService.signJWT({
      userId: result.id.toString(),
      email: result.email.value,
    });
    await this.authService.saveAuthenticatedUser(result);

    return E.right(result);
  }
}
