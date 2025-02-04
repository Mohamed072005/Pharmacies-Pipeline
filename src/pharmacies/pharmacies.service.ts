import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pharmacy } from './schemas/pharmacy.schema';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectModel(Pharmacy.name) private readonly pharmacyModel: Model<Pharmacy>,
  ) {}

  // Create a new pharmacy
  async create(pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    return new this.pharmacyModel(pharmacy).save();
  }

  // Get all pharmacies
  async findAll(): Promise<Pharmacy[]> {
    return this.pharmacyModel.find().exec();
  }

  // Get a pharmacy by ID
  async findById(id: Types.ObjectId): Promise<Pharmacy> {
    const pharmacies = await this.pharmacyModel.findById({ _id: id }).exec();
    if(!pharmacies){
      throw new HttpException('Pharmacy not found', HttpStatus.NOT_FOUND);
    }
    return pharmacies;
  }

  // Update a pharmacy
  async update(id: string, updateData: Partial<Pharmacy>): Promise<Pharmacy> {
    return this.pharmacyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Delete a pharmacy
  async delete(id: string): Promise<Pharmacy> {
    return this.pharmacyModel.findByIdAndDelete(id).exec();
  }

  // Find pharmacies near a location (geospatial query)
  async findNearby(longitude: number, latitude: number, distanceInMeters: number): Promise<Pharmacy[]> {
    return this.pharmacyModel
      .find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: distanceInMeters,
          },
        },
      })
      .exec();
  }
}
