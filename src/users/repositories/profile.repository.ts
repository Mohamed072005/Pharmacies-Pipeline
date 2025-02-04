import { Injectable } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile.repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  async create(createProfileDto: CreateProfileDto & { userId: string }): Promise<Profile> {
    const profile = new this.profileModel(createProfileDto);
    return profile.save();
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile | null> {
    return this.profileModel
      .findOneAndUpdate(
        { userId: userId },
        { $set: updateProfileDto },
        {
          new: true,
        },
      )
      .exec();
  }


}
