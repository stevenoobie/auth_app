import { Document } from 'mongoose';

export interface RefreshToken extends Document {
  readonly userId: string;
  readonly token: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;
}
