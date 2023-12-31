import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { OfferType, CityName, Goods } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

class Location {
  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

class City {
  @prop({required: true, type: () => String, enum: CityName})
  public name!: CityName;

  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true})
  public title!: string;

  @prop({required: true, trim: true})
  public description!: string;

  @prop({required: true})
  public offerDate!: Date;

  @prop({required: true, _id: false})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true, type: () => [String]})
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public isFavorite!: boolean;

  @prop({required: true})
  public rating!: number;

  @prop({required: true, type: () => String, enum: OfferType })
  public type!: OfferType;

  @prop({required: true})
  public bedrooms!: number;

  @prop({required: true})
  public maxAdults!: number;

  @prop({required: true})
  public price!: number;

  @prop({required: true, type: () => [String], enum: Goods })
  public goods!: Goods[];

  @prop({ ref: UserEntity, required: true })
  public advertiserId!: Ref<UserEntity>;

  @prop({default: 0})
  public commentCount!: number;

  @prop({required: true, _id: false})
  public location!: Location;

  @prop({required: true, ref: UserEntity, _id: false, default: [], type: () => [String]})
  public favoriteForUsers!: Ref<UserEntity>[];
}

export const OfferModel = getModelForClass(OfferEntity);
