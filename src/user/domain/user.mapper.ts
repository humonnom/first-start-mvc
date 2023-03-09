import { Prisma, User as UserDao } from '@prisma/client';
import User from './user.model';
import * as E from 'fp-ts/Either';

export class UserMapper {
  // static toPrisma(user: User): UserDao {
  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email.value,
  //     phone: user.phone,
  //     age: user.age.value,
  //   };
  // }
  // TODO: toPrisma 구현

  static toDomain(prismaUser: UserDao): User {
    const user = User.create({
      email: prismaUser.email,
      phone: prismaUser.phone,
      age: prismaUser.age,
      name: prismaUser.name,
    });

    if (E.isRight(user)) {
      return user.right;
    } else {
      return {} as User;
    }
  }
}
