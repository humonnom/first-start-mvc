export enum UserCreationErrors {
  EmailAlreadyExists = 'EmailAlreadyExists',
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
