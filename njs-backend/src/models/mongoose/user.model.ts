import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  isAdmin: boolean; // if user is not admin, he is editor. readers are not inside the database
//  password?: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    unique: false,
  },
//   password: {
//       type: String,
//       required: false,
//       unique: false,
//   }
});

userSchema.index({name: 1});

export default mongoose.model<IUser>('User', userSchema);

