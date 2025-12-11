import { Connection } from 'mongoose';
import { DB_CONNECTION, USER_MODEL } from 'src/database/constants';
import { UserSchema } from 'src/schemas/user.schema';

export const userProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DB_CONNECTION],
  },
];
