import { City, Goods, Location, OfferType } from '../../../types/index.js';

export class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public offerDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public rating!: number;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Goods[];
  public advertiserId!: string;
  public location!: Location;
}
