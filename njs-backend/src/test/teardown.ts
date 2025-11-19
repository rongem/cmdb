import mongoose from 'mongoose';

export default async function disconnect() {
    // stop & disconnect database here
    await mongoose.disconnect();
}