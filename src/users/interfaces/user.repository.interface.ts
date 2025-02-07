import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByCredentials(email: string): Promise<User | null>;
  create(
    userData: CreateUserDto & {
      password: string;
    },
  ): Promise<User>;
  update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  exists(email: string, username: string): Promise<boolean>;
}
