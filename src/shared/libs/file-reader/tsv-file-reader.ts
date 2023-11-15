import { readFileSync, accessSync, constants } from 'node:fs';

import { FileReader } from './file-reader.interface.js';

import type { RentOffer } from '../../types/rent-offer.type.js';
import type { User } from '../../types/user.type.js';
import type { Location } from '../../types/location.type.js';
import type { Goods } from '../../types/goods-type.enum.js';
import type { City } from '../../types/city-type.enum.js';
import type { OfferType } from '../../types/offer-type.enum.js';
import type { UserStatus } from '../../types/user-status.type.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  public read(): void {
    try {
      accessSync(this.filename, constants.R_OK);
      this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
      console.log('can read');
    } catch (err) {
      console.error(err);
    }
  }

  public toArray(): RentOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map((offer) => {
        const [
          title,
          description,
          offerDate,
          city,
          previewImage,
          images,
          isPremium,
          isFavorite,
          rating,
          type,
          bedrooms,
          maxAdults,
          price,
          goods,
          name,
          email,
          avatarPath,
          password,
          userType,
          latitude,
          longitude
        ] = offer;

        const offerImages: string[] = images.split(';');
        const offerGoods = goods.split(';') as Goods[];
        const user: User = {
          name,
          email,
          avatarPath,
          password,
          type: userType as UserStatus
        };
        const location: Location = {
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
        };

        return {
          title,
          description,
          offerDate,
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
          goods: offerGoods,
          user,
          location
        };
      });
  }
}
