import type { UserStatus } from './user-status.type.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  type: UserStatus;
};
