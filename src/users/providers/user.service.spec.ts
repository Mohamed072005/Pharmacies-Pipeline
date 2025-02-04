import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { ProfileService } from './profile.service';
import { Types } from 'mongoose';
import { UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException } from '../exceptions/user.exceptions';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let userService: UserService;

  const TEST_USER = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
  } as const;

  const mockUserRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findByCredentials: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    exists: jest.fn(),
  };

  const mockProfileService = {
    createProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: mockUserRepo }, { provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      mockUserRepo.findAll.mockResolvedValue([TEST_USER]);

      const result = await userService.getAllUsers();

      expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([TEST_USER]);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockUserRepo.findById.mockResolvedValue(TEST_USER);

      const result = await userService.findById(TEST_USER._id.toString());

      expect(mockUserRepo.findById).toHaveBeenCalledWith(TEST_USER._id.toString());
      expect(result).toEqual(TEST_USER);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.findById(TEST_USER._id.toString())).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create user and profile successfully', async () => {
      mockUserRepo.exists.mockResolvedValue(false);
      mockUserRepo.create.mockResolvedValue(TEST_USER);

      const result = await userService.createUser(createUserDto);

      expect(mockUserRepo.exists).toHaveBeenCalled();
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: createUserDto.username,
          email: createUserDto.email,
          password: expect.any(String),
        }),
      );
      expect(mockProfileService.createProfile).toHaveBeenCalled();
      expect(result).toEqual(TEST_USER);
    });

    it('should throw UserAlreadyExistsException when user exists', async () => {
      mockUserRepo.exists.mockResolvedValue(true);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(UserAlreadyExistsException);
    });
  });

  describe('validateCredentials', () => {
    const credentials = {
      email: TEST_USER.email,
      password: 'password123',
    };

    beforeEach(() => {
      jest.spyOn(bcrypt, 'compare');
    });

    it('should validate correct credentials', async () => {
      mockUserRepo.findByCredentials.mockResolvedValue(TEST_USER);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.validateCredentials(credentials.email, credentials.password);

      expect(result).toEqual(TEST_USER);
    });

    it('should throw InvalidCredentialsException for wrong password', async () => {
      mockUserRepo.findByCredentials.mockResolvedValue(TEST_USER);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.validateCredentials(credentials.email, credentials.password)).rejects.toThrow(InvalidCredentialsException);
    });
  });
});
