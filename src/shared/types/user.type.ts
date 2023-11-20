import type { UserStatus } from './index.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  type: UserStatus;
};
