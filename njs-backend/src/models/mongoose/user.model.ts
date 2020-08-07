import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  role: number; // 0 = readers, 1 = editors, 2 = administrators, other = invalid
  lastVisit: Date;
//  passphrase?: string;
//  displayName?: string;
//  mail?: string;
//  phone?: string;
//  office?: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: Number,
    required: true,
    unique: false,
  },
  lastVisit: {
    type: Date,
    required: true,
    unique: false,
  }
//   passphrase: {
//       type: String,
//       required: false,
//       unique: false,
//   }
//   displayName: {
//       type: String,
//       required: false,
//       unique: false,
//   }
//   mail: {
//       type: String,
//       required: false,
//       unique: false,
//   }
//   phone: {
//       type: String,
//       required: false,
//       unique: false,
//   }
//   office: {
//       type: String,
//       required: false,
//       unique: false,
//   }
});

userSchema.index({name: 1});

export default mongoose.model<IUser>('User', userSchema);

