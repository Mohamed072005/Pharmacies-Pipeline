import { Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';
import { ProfileService } from './profile.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException } from '../exceptions/user.exceptions';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Retrieves all users from the database
   * @returns Promise containing array of all users
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Finds a user by their ID
   * @param userId - The ID of the user to find
   * @throws UserNotFoundException if user not found
   * @returns Promise containing the found user
   */
  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    this.validateUserExists(user);
    return user;
  }

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @throws UserNotFoundException if user not found
   * @returns Promise containing the found user
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    this.validateUserExists(user);
    return user;
  }

  /**
   * Finds a user by their username
   * @param username - The username to search for
   * @throws UserNotFoundException if user not found
   * @returns Promise containing the found user
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    this.validateUserExists(user);
    return user;
  }

  /**
   * Creates a new user and their associated profile
   * @param createUserDto - Data for creating the new user
   * @throws UserAlreadyExistsException if email or username already exists
   * @returns Promise containing the created user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUniqueUser(createUserDto.email, createUserDto.username);
    const user = await this.createUserWithProfile(createUserDto);
    return user;
  }

  /**
   * Updates an existing user's information
   * @param userId - ID of the user to update
   * @param updateUserDto - New user data
   * @throws UserNotFoundException if user not found
   * @throws UserAlreadyExistsException if new email/username already exists
   * @returns Promise containing the updated user
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.validateExistingUser(userId);
    await this.validateUniqueConstraints(existingUser, updateUserDto);

    const updatedUser = await this.userRepository.update(userId, updateUserDto);
    this.validateUserExists(updatedUser);
    return updatedUser;
  }




  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByCredentials(email);
    this.validateUserExists(user);

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  /**
   * Checks if a user with given email or username exists
   * @param email - Email to check
   * @param username - Username to check
   * @returns Promise containing boolean indicating if user exists
   */
  async exists(email: string, username: string): Promise<boolean> {
    return this.userRepository.exists(email, username);
  }

  /**
   * Helper method to create a user and their profile
   * @param createUserDto - Data for creating the user
   * @returns Promise containing the created user
   * @private
   */
  private async createUserWithProfile(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,

    });

    await this.profileService.createProfile({
      userId: (user._id as Types.ObjectId).toHexString(),
      theme: 'light',
    });

    return user;
  }

  /**
   * Validates that email and username are unique
   * @param email - Email to validate
   * @param username - Username to validate
   * @throws UserAlreadyExistsException if either exists
   * @private
   */
  private async validateUniqueUser(email: string, username: string): Promise<void> {
    const exists = await this.userRepository.exists(email, username);
    if (exists) {
      throw new UserAlreadyExistsException();
    }
  }

  /**
   * Validates that a user exists by ID
   * @param userId - ID to validate
   * @throws UserNotFoundException if user not found
   * @returns Promise containing the found user
   * @private
   */
  private async validateExistingUser(userId: string): Promise<User> {
    return this.findById(userId);
  }

  /**
   * Validates uniqueness constraints for user updates
   * @param existingUser - Current user data
   * @param updateUserDto - New user data
   * @throws UserAlreadyExistsException if constraints violated
   * @private
   */
  private async validateUniqueConstraints(existingUser: User, updateUserDto: UpdateUserDto): Promise<void> {
    if (!updateUserDto.email && !updateUserDto.username) {
      return;
    }

    const exists = await this.userRepository.exists(updateUserDto.email || existingUser.email, updateUserDto.username || existingUser.username);

    if (exists) {
      throw new UserAlreadyExistsException();
    }
  }

  /**
   * Validates that a user exists
   * @param user - User to validate
   * @throws UserNotFoundException if user is null
   * @private
   */
  private validateUserExists(user: User | null): void {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  /**
   * Hashes a password using bcrypt
   * @param password - Password to hash
   * @returns Promise containing the hashed password
   * @private
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verifies a password against its hash
   * @param password - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns Promise containing boolean indicating if password is valid
   * @private
   */
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
