import * as mongoose from 'mongoose';
import { DB_CONNECTION, DB_CONNECTION_STRING } from './constants';

export const databaseProviders = [
  {
    provide: DB_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(DB_CONNECTION_STRING),
  },
];
