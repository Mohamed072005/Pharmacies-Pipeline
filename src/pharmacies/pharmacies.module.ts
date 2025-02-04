import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesController } from './pharmacies.controller';
import { Pharmacy, PharmacySchema } from './schemas/pharmacy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pharmacy.name, schema: PharmacySchema }]),
    // MongooseModule.forRoot('mongodb://localhost:27017/pharmacy')
  ],
  controllers: [PharmaciesController],
  providers: [PharmaciesService],
  exports: [PharmaciesService]
})
export class PharmaciesModule {}
