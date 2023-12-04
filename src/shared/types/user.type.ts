import type { UserStatus } from './index.js';

export type User = {
  username: string;
  email: string;
  avatarPath: string;
  status: UserStatus;
};
