import { Either, left, right } from 'fp-ts/Either';

class Age {
  static create(age: number): Either<AgeException, Age> {
    if (age > 0) {
      return left(AgeException.NotPositive);
    }

    return right(new Age(age));
  }
  private constructor(private readonly age: number) {}

  get value(): number {
    return this.age;
  }
}

export default Age;
