import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritePharmacy, FavoritePharmacySchema } from './favorite_pharnacy.schema';
import { FavoritePharmacyController } from './favorite_pharnacy.controller';
import { FavoritePharmacyService } from './favorite_pharnacy.service';
import { FavoritePharmacyRepository } from './favorite_pharnacy.repository';
import { PharmaciesModule } from '../pharmacies/pharmacies.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: FavoritePharmacy.name, schema: FavoritePharmacySchema }]),
        PharmaciesModule
    ],
    controllers: [FavoritePharmacyController],
    providers: [
        {
            provide: 'FavoritePharmacyServiceInterface',
            useClass: FavoritePharmacyService
        },
        {
            provide: 'FavoritePharmacyRepositoryInterface',
            useClass: FavoritePharmacyRepository
        },
    ],
})
export class FavoritePharmacyModule { }
