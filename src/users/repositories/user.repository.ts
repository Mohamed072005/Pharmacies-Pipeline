import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByCredentials(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(
    userData: CreateUserDto & {
      password: string;
    },
  ): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }

  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, { isOnline }, { new: true }).exec();
  }

  async exists(email: string, username: string): Promise<boolean> {
    const user = await this.userModel.exists({
      $or: [{ email }, { username }],
    });
    return !!user;
  }
}
