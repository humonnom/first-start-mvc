import * as O from 'fp-ts/Option';
import { User as UserDao } from '@prisma/client';
import User from '../domain/user.model';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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

  async findUserById(id: number): Promise<UserDao | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async saveUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        age: user.age.value,
        email: user.email.value,
        phone: user.phone,
      },
    });

    return UserMapper.toDomain(createdUser);
  }
}

export default UserRepository;
