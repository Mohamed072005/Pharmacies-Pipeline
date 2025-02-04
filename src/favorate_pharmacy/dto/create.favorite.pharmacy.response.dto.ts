import { FavoritePharmacyEntity } from "../interfaces/favorite.pharmacy.entity";

export class CreateFavoritePharmacyResponseDTO {
    statusCode: number;
    message: string;
    favorite_pharmacy: FavoritePharmacyEntity;
}