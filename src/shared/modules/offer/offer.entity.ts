import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { OfferType, CityName, Goods } from '../../types/index.js';

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

  @prop()
  public offerDate?: Date;

  @prop({required: true, _id: false})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true, type: () => [String]})
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop()
  public isFavorite?: boolean;

  @prop({default: 0})
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

  @prop({default: 0})
  public commentsCount!: number;

  @prop({required: true, _id: false})
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
