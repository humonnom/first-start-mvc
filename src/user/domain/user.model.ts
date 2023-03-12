import Email from './email';
import UserCreationErrors from './errors';
import { CreateUserDto } from '../dto/create-user.dto';
import Age from './age';
import * as E from 'fp-ts/Either';
import EmailException from './errors/email.exception';
import AgeException from './errors/age.exception';

// 1. const a = User({id: 1, name: "junsuk park", email:  "park64kr63@gmail.com"})
// 2. const b = User({id: 2, name: "junsuk park", email: "jueun@naver.com"})
// User.equal(a, b) === false

class User {
  static create(dto: CreateUserDto): E.Either<UserCreationErrors, User> {
    const emailOrError = Email.create(dto.email);
    const ageOrError = Age.create(dto.age);

    if (E.isLeft(emailOrError)) {
      let error: UserCreationErrors;
      switch (emailOrError.left) {
        case EmailException.NotAppropriate:
          error = UserCreationErrors.NotAppropriateEmail;
      }

      return E.left(error);
    }

    if (E.isLeft(ageOrError)) {
      let error: UserCreationErrors;
      switch (ageOrError.left) {
        case AgeException.NotPositive:
          error = UserCreationErrors.NotPositiveAge;
          break;
      }
      return E.left(error);
    }

    return E.right(
      new User(dto.name, ageOrError.right, emailOrError.right, dto.phone),
    );
  }
  private constructor(
    readonly name: string,
    readonly age: Age,
    readonly email: Email,
    readonly phone: string,
  ) {}
}

export default User;
