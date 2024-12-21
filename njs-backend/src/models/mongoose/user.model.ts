import { Schema, Document, Model, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  role: number; // 0 = readers, 1 = editors, 2 = administrators, other = invalid
  lastVisit: Date;
  passphrase?: string;
//  displayName?: string;
//  mail?: string;
//  phone?: string;
//  office?: string;
}

const userSchema = new Schema<IUser, Model<IUser>>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: Number,
    required: true,
    unique: false,
    enum: [0, 1, 2],
  },
  lastVisit: {
    type: Date,
    required: true,
    unique: false,
  },
  passphrase: {
      type: String,
      required: false,
      unique: false,
  },
//   displayName: {
//       type: String,
//       required: false,
//       unique: false,
//   },
//   mail: {
//       type: String,
//       required: false,
//       unique: false,
//   },
//   phone: {
//       type: String,
//       required: false,
//       unique: false,
//   },
//   office: {
//       type: String,
//       required: false,
//       unique: false,
//   },
});

// commented out because of mongoose 8.9.2 error. Mongoose sucks!
//userSchema.index({name: 1}, {unique: true});

export const userModel = model<IUser, Model<IUser>>('User', userSchema);

