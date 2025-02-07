import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Test constants
  const TEST_USER = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password',
  } as const;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: TEST_USER.email,
      password: TEST_USER.password,
    };

    it('should call authService.login with correct credentials and return token', async () => {
      const expectedResult = {
        access_token: 'jwt.token.here',
        user: { id: TEST_USER.id, email: TEST_USER.email },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: TEST_USER.email,
      password: TEST_USER.password,
      username: TEST_USER.username,
    };

    it('should call authService.register with correct user data and return token', async () => {
      const expectedResult = {
        access_token: 'jwt.token.here',
        user: {
          id: TEST_USER.id,
          email: TEST_USER.email,
          username: TEST_USER.username,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw when registration fails', async () => {
      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('logout', () => {
    it('should call req.logout() and handle callback', async () => {
      const mockReq = {
        logout: jest.fn((callback) => callback && callback()),
      };

      await controller.logout(mockReq);

      expect(mockReq.logout).toHaveBeenCalled();
    });

    it('should handle logout error', async () => {
      const mockReq = {
        logout: jest.fn((callback) => {
          if (callback) callback(new Error('Logout failed'));
          throw new Error('Logout failed');
        }),
      };

      await expect(controller.logout(mockReq)).rejects.toThrow('Logout failed');
    });
  });
});
