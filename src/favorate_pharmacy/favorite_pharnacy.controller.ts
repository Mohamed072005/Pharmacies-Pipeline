import { BadRequestException, Body, Controller, HttpException, HttpStatus, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateFavoritePharmacyDTO } from "./dto/create.favorite.pharmacy.dto";
import { CreateFavoritePharmacyResponseDTO } from "./dto/create.favorite.pharmacy.response.dto";
import mongoose from "mongoose";
import { FavoritePharmacyServiceInterface } from "./interfaces/favorite_pharmacy.service.interface";
import { ObjectIdTransformer } from "../common/transformers/object_id.transformer";

@Controller('favorite')
export class FavoritePharmacyController {

    constructor(
        @Inject('FavoritePharmacyServiceInterface') private readonly favoritePharmacyService: FavoritePharmacyServiceInterface
    ){}

    @Post('/create')
    @UsePipes(new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => {
            const formattedErrors = errors.map(error => ({
                field: error.property,
                constraint: Object.values(error.constraints || {})[0]
            }));

            throw new BadRequestException(formattedErrors);
        }
    }))
    async createFavoritePharmacy(
        @Body() createFavoritePharnacyDTO: CreateFavoritePharmacyDTO
    ): Promise<CreateFavoritePharmacyResponseDTO> {
        try{            
            const userId = new mongoose.Types.ObjectId('674ba1315bbead3ecff62996')
            createFavoritePharnacyDTO.pharmacy_id = ObjectIdTransformer.toObjectId(createFavoritePharnacyDTO.pharmacy_id);
            const favoritePharmacy = await this.favoritePharmacyService.handelCreateFavoritePharmacy(createFavoritePharnacyDTO, userId)
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Favorite Pharmacy Created Successfully',
                favorite_pharmacy: favoritePharmacy
            }
        }catch(err: any){
            if(err instanceof HttpException){
                throw new HttpException({ message: err.getResponse()}, err.getStatus())
            }
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred',
                error: err.message || 'Internal Server Error'
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}