import { Either, left, right } from 'fp-ts/Either';
import EmailException from './errors/email.exception';

class Email {
  static create(email: string): Either<EmailException, Email> {
    const regex = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
    );
    if (!regex.test(email)) {
      return left(EmailException.NotAppropriate);
    }

    return right(new Email(email));
  }
  private constructor(private readonly email: string) {}

  get value(): string {
    return this.email;
  }
}

export default Email;
