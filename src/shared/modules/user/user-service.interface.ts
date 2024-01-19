import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { CreateUserDTO, UpdateUserDTO, UserEntity } from './index.js';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null>;
  findUserFavorites(userId: string): Promise<DocumentType<OfferEntity>[] | null> ;
  changeFavoriteStatus(userId: string, offerId: string, status: boolean): Promise<DocumentType<UserEntity> | null>
}
