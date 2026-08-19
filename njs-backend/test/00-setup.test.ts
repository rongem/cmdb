// src/test/setup.ts
import { before, after } from 'node:test';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./src/test/.env') });

before(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing');
  }
  await mongoose.connect(process.env.MONGODB_URI);
});

after(async () => {
  await mongoose.disconnect();
});
