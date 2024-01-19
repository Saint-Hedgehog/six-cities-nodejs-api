import { UserStatus } from '../../../types/index.js';

export class CreateUserDTO {
  public username!: string;
  public password!: string;
  public email!: string;
  public avatarPath!: string;
  public status!: UserStatus;
}
