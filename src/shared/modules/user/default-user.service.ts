import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { CreateUserDTO, UpdateUserDTO, UserEntity, UserService } from './index.js';
import { Logger } from '../../libs/logger/index.js';

import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const userEntry = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return userEntry;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async findUserFavorites(userId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel
      .findById(userId, {favorites: true, _id: false})
      .populate<{favorites: DocumentType<OfferEntity>[]}>('favorites', {}, '', {sort: {createdAt: SortType.Down}})
      .orFail()
      .exec()
      .then((res) => res.favorites);
  }

  public async changeFavoriteStatus(userId: string, offerId: string, status: boolean): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, {[`${status ? '$addToSet' : '$pull'}`]: { favorites: offerId }}, {new: true}).exec();
  }
}
