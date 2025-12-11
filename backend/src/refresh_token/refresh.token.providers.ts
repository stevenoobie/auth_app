import { Connection } from 'mongoose';
import { DB_CONNECTION, REFRESH_TOKEN_MODEL } from 'src/database/constants';
import { RefreshTokenSchema } from 'src/schemas/refresh.token.schema';

export const refreshTokenProviders = [
  {
    provide: REFRESH_TOKEN_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('RefreshToken', RefreshTokenSchema),
    inject: [DB_CONNECTION],
  },
];
