import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  createUser(createUserDto: CreateUserDto): Promise<User>;
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  validateCredentials(email: string, password: string): Promise<User>;
  exists(email: string, username: string): Promise<boolean>;
}
