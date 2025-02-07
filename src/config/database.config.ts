import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: "mongodb://localhost:27017/pharmacy",
  options: {
    dbName:'pharmacy',
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    family: 4
  }
}));