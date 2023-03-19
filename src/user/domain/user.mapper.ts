import { User as UserDao } from '@prisma/client';
import User from './user.model';
import * as E from 'fp-ts/Either';
import { O } from 'ts-toolbelt';

export class UserMapper {
  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      phone: user.phone,
      age: user.age.value,
    };
  }

  static toDomain(prismaUser: UserDao) {
    const user = User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      phone: prismaUser.phone,
      age: prismaUser.age,
      name: prismaUser.name,
    });

    return (user as E.Right<User>).right;
  }
}
