import Email from './email';
import UserCreationErrors from './errors';
import { CreateUserDto } from '../dto/create-user.dto';
import Age from './age';
import * as E from 'fp-ts/Either';
import EmailException from './errors/email.exception';

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
        case AgeException.Random:
          error = UserCreationErrors.RandomAge;
          break;
      }
      return E.left(error);
    }

    return E.right(
      new User(dto.name, ageOrError.right, emailOrError.right, dto.phone),
    );
  }
  private constructor(
    private readonly name: string,
    private readonly age: Age,
    private readonly email: Email,
    private readonly phone: string,
  ) {}
}

export default User;
