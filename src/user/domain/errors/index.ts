export enum UserCreationErrors {
  EmailAlreadyExists = 'P2002',
  InvalidEmail = 'InvalidEmail',
  InvalidAgeNumber = 'InvalidAgeNumber',
  NotAppropriateEmail = 'NotAppropriateEmail',
  NotPositiveAge = 'NotPositiveAge',
  RandomAge = 'RandomAge',
}

export enum UserFindErrors {
  UserNotFound = 'UserNotFound',
}

export default UserCreationErrors;
