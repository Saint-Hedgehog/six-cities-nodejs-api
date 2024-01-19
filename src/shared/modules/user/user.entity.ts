import { prop, modelOptions, defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { User, UserStatus } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '' })
  public username!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: false, default: '' })
  public avatarPath!: string;

  @prop({ required: true, default: '' })
  public password?: string;

  @prop({required: true, type: () => String, enum: UserStatus})
  public status!: UserStatus;

  @prop({required: true, ref: () => OfferEntity, _id: false, default: [], type: () => [OfferEntity]})
  public favorites!: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();

    this.username = userData.username;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.status = userData.status;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
