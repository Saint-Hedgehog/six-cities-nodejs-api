import { Expose } from 'class-transformer';

export class NewUserRDO {
  @Expose()
  public username!: string;

  @Expose()
  public email!: string;

  @Expose()
  public status!: string;

  @Expose()
  public avatarPath!: string;
}
