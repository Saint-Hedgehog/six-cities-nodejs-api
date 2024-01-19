import { injectable, inject } from 'inversify';
import { types, DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO, OfferEntity, OfferService, UpdateOfferDTO } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const offerEntry = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return offerEntry.populate(['advertiserId']);
  }

  public async findById(offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['advertiserId'])
      .transform((doc) => doc === null ? doc : Object.assign(doc, {isFavorite}))
      .exec();
  }

  public async find(offersCount: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { $expr: {$eq: [userId, { $toString: '$_id'}] } } },
            { $project: {_id: false, favorites: true}}
          ],
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          isFavorite: {
            $cond: [{$ne: [{ $type: '$user.favorites'}, 'missing']},
              {$cond: [{$in: ['$_id', '$user.favorites']}, true, false]},
              false]
          }
        }
      },
      { $unset: 'user' },
      { $sort: { createdAt: SortType.Down }},
      { $limit: offersCount}
    ]).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['advertiserId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findPremium(city: string, offersCount: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      { $match:
        {$and:
          [
            { $expr: {$eq: ['$city.name', city] } },
            { $expr: {$eq: ['$isPremium', true] } }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { $expr: {$eq: [userId, { $toString: '$_id'}] } } },
            { $project: {_id: false, favorites: true}}
          ],
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          isFavorite: {
            $cond: [{$ne: [{ $type: '$user.favorites'}, 'missing']},
              {$cond: [{$in: ['$_id', '$user.favorites']}, true, false]},
              false]
          }
        }
      },
      { $unset: 'user' },
      { $sort: { createdAt: SortType.Down }},
      { $limit: offersCount}
    ]).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': { commentCount: 1 }})
      .exec();
  }
}
