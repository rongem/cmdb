import { Schema, Document, Model, model, Types } from 'mongoose';

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

userSchema.index({name: 1}, {unique: true});

userSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
  try {
      const count = await userModel.findById(value).countDocuments();
      return count > 0 ? Promise.resolve() : Promise.reject();
  }
  catch (err) {
      return Promise.reject(err);
  }
};

userSchema.statics.mValidateIdExists = (value: Types.ObjectId) => userModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

userSchema.statics.validateNameDoesNotExist = async (name: string) => {
  try {
    const count = await userModel.find({name}).countDocuments();
    return count === 0 ? Promise.resolve() : Promise.reject();
  } catch (err) {
    return Promise.reject(err);
  }
};

export interface IUserModel extends Model<IUser> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExist(value: string): Promise<void>;
}

export const userModel = model<IUser, IUserModel>('User', userSchema);

