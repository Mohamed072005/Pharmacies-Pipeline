import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { Pharmacy } from './schemas/pharmacy.schema';
import { Types } from 'mongoose';
import { ObjectIdTransformer } from 'src/common/transformers/object_id.transformer';

@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) { }

  @Post()
  async create(@Body() pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    return this.pharmaciesService.create(pharmacy);
  }

  @Get()
  async findAll(): Promise<Pharmacy[]> {
    return this.pharmaciesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Pharmacy> {
    try {
      const objectId = ObjectIdTransformer.toObjectId(id);
      const pharmacies = await this.pharmaciesService.findById(objectId); 
      return pharmacies
    } catch (err: any) {      
      if(err instanceof HttpException){
        throw new HttpException({ message: err.getResponse()}, err.getStatus());
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Pharmacy>): Promise<Pharmacy> {
    return this.pharmaciesService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Pharmacy> {
    return this.pharmaciesService.delete(id);
  }

  @Get('nearby')
  async findNearby(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('distance') distance: number,
  ): Promise<Pharmacy[]> {
    return this.pharmaciesService.findNearby(longitude, latitude, distance);
  }
}
