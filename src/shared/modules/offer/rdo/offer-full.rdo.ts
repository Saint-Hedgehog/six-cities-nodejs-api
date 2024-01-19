import { Expose, Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import { City } from '../index.js';

class Location {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

class Advertiser {
  @Expose()
  public username!: string;

  @Expose()
  public email!: string;

  @Expose()
  public status!: string;

  @Expose()
  public avatarPath!: string;
}

export class OfferFullRDO {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose({name: 'createdAt'})
  @Type(() => Date)
  public offerDate!: Date;

  @Expose()
  @Type(() => City)
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: string[];

  @Expose({name: 'advertiserId'})
  @Type(() => Advertiser)
  public advertiser!: Advertiser;

  @Expose()
  public commentsCount!: number;

  @Expose()
  @Type(() => Location)
  public location!: Location;
}
