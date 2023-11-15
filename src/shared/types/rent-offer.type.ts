import type { City } from './city-type.enum.js';
import type { Goods } from './goods-type.enum.js';
import type { Location } from './location.type.js';
import type { OfferType } from './offer-type.enum.js';
import type { User } from './user.type.js';

export type RentOffer = {
  title: string,
  description: string,
  offerDate: string,
  city: City,
  previewImage: string,
  images: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  bedrooms: number,
  maxAdults: number,
  price: number,
  goods: Goods[],
  user: User,
  location: Location,
}
