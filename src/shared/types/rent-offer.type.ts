import { City, Goods, Location, OfferType, User } from './index.js';

export type RentOffer = {
  title: string,
  description: string,
  offerDate: Date,
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
  advertiser: User,
  location: Location,
}
