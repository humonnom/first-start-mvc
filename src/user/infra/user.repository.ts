import * as O from 'fp-ts/Option';
import User from '../domain/user.model';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserMapper } from '../domain/user.mapper';

@Injectable()
class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<O.Option<User>> {
    const userOrNull = O.fromNullable(
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      }),
    );

    return O.map(UserMapper.toDomain)(userOrNull);
  }

  async findUserById(id: number): Promise<O.Option<User>> {
    const userOrNull = O.fromNullable(
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      }),
    );

    return O.map(UserMapper.toDomain)(userOrNull);
  }

  async saveUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(createdUser);
  }
}

export default UserRepository;
