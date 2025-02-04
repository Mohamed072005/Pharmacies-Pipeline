import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from '../providers/user.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: jest.Mocked<UserService>;

  const mockUserService = {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
   
  };

  const completeUser: Partial<User> = {
    id: '1',
    username: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
  
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get(UserService);

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: Partial<User>[] = [completeUser];
      userService.getAllUsers.mockResolvedValue(users as User[]);

      const result = await controller.getAllUsers();
      expect(result).toEqual(users);
      expect(userService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const user: User = { ...completeUser, ...createUserDto } as User;
      userService.createUser.mockResolvedValue(user);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(user);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'John Doe Updated',
        email: 'john@example.com',
      };
      const user: User = { ...completeUser, ...updateUserDto } as User;
      userService.updateUser.mockResolvedValue(user);

      const result = await controller.updateUser('1', updateUserDto);
      expect(result).toEqual(user);
      expect(userService.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user: User = {
        ...completeUser,
        email: 'john@example.com',
      } as User;
      userService.findByEmail.mockResolvedValue(user);

      const result = await controller.findByEmail('john@example.com');
      expect(result).toEqual(user);
      expect(userService.findByEmail).toHaveBeenCalledWith('john@example.com');
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const user: User = {
        ...completeUser,
        username: 'johndoe',
      } as User;
      userService.findByUsername.mockResolvedValue(user);

      const result = await controller.findByUsername('johndoe');
      expect(result).toEqual(user);
      expect(userService.findByUsername).toHaveBeenCalledWith('johndoe');
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user: User = { ...completeUser, id: '1' } as User;
      userService.findById.mockResolvedValue(user);

      const result = await controller.getUserById('1');
      expect(result).toEqual(user);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(controller.getUserById('1')).rejects.toThrow(NotFoundException);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });
  });


});
