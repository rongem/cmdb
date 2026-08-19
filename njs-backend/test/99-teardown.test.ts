import { after } from 'node:test';
import mongoose from 'mongoose';

after(async () => {
  await mongoose.disconnect();
});
