import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class ProfileNotFoundException extends HttpException {
  constructor() {
    super('Profile not found', HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
