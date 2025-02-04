import { Types } from "mongoose";
import { CreateFavoritePharmacyDTO } from "../dto/create.favorite.pharmacy.dto";
import { FavoritePharmacyEntity } from "./favorite.pharmacy.entity";

export interface FavoritePharmacyServiceInterface {
    handelCreateFavoritePharmacy(createFavoritePharmacyDTO: CreateFavoritePharmacyDTO, userId: Types.ObjectId): Promise<FavoritePharmacyEntity>
}