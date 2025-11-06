// import { database } from '../models/db';
import mongoose from 'mongoose';
import path from 'path';
// import { app } from '../app';

require('dotenv').config({path: path.resolve('./src/test/.env')});

jest.setTimeout(30000);
beforeAll(() => {
    // start database here
    expect(process.env.MONGODB_URI).toBeDefined();
    return mongoose.connect(process.env.MONGODB_URI!);
});

beforeEach(() => {
    // reset all data in database
});

afterAll(() => {
    // stop & disconnect database here
    // return mongoose.disconnect();
});
