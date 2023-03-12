export enum UserCreationErrors {
  EmailAlreadyExists = 'EmailAlreadyExists',
  InvalidEmail = 'InvalidEmail',
  InvalidAgeNumber = 'InvalidAgeNumber',
  NotAppropriateEmail = 'NotAppropriateEmail',
  NotPositiveAge = 'NotPositiveAge',
}

export enum UserFindErrors {
  UserNotFound = 'UserNotFound',
}

export default UserCreationErrors;
