import { injectable, inject } from 'inversify';
import { types, DocumentType } from '@typegoose/typegoose';
import { DEFAULT_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT, OfferEntity, OfferService } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, offerDate: new Date()});
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['advertiserId'])
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFERS_COUNT;
    return this.offerModel
      .find({}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['advertiserId'])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
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

  public async findPremium(city: CityName): Promise<DocumentType<OfferEntity>[]> {
    const limit = MAX_PREMIUM_OFFERS_COUNT;
    return this.offerModel
      .find({'city.name': `${city}`}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['advertiserId'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': { commentCount: 1 }})
      .exec();
  }
}
