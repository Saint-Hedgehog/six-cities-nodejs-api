import { City, Goods, Location, OfferType, RentOffer, User, UserStatus } from '../types/index.js';

export function createOffer(offerData: string): RentOffer {
  const [
    title, description, offerDate, city,
    previewImage, images, isPremium, isFavorite,
    rating, type, bedrooms, maxAdults,
    price, goods, username, email,
    avatar, userStatus, longitude, latitude
  ] = offerData.replace('\n', '').split('\t');

  const offerImages = images.split(';');
  const offerGoods = goods.split(';');
  const location: Location = {
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude),
  };
  const advertiser: User = {
    username,
    email,
    avatarPath: avatar,
    status: userStatus as UserStatus
  };

  return {
    title,
    description,
    offerDate: new Date(offerDate),
    city: city as City,
    previewImage,
    images: offerImages,
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number.parseFloat(rating),
    type: type as OfferType,
    bedrooms: Number.parseInt(bedrooms, 10),
    maxAdults: Number.parseInt(maxAdults, 10),
    price: Number.parseInt(price, 10),
    goods: offerGoods as Goods[],
    advertiser,
    location
  };
}
