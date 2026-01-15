import mongoose from 'mongoose';

export default function disconnect() {
    // stop & disconnect database here
    mongoose.disconnect();
}