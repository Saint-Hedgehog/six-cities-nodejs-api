import { City, Goods, Location, OfferType } from '../../../types/index.js';

export class UpdateOfferDTO {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public rating?: number;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Goods[];
  public location?: Location;
}
