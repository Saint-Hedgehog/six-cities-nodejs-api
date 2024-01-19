import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO, OfferEntity, UpdateOfferDTO } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity> | null>;
  find(count: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city: string, offersCount: number, userId?: string): Promise<DocumentType<OfferEntity>[]>
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
