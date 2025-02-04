import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/providers/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('test-user@example.test', 'test-password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        email: 'test-user@example.test',
        password: 'password',
      };
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test-user@example.test', 'wrong-password')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user when credentials are valid', async () => {
      const mockUser = {
        email: 'test-user@example.test',
        password: 'password',
      };
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test-user@example.test', 'test-password');
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
        id: 1,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'mock-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });

  describe('register', () => {
    it('should create user and return access token', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      mockUserService.createUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.register(registerDto);

      expect(result).toEqual({ access_token: 'mock-token' });
      expect(userService.createUser).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
});
