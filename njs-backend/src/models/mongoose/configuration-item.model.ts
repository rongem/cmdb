import { Schema, Document, Types, Model, model, SchemaTimestampsConfig } from 'mongoose';

import { attributeTypeModel } from './attribute-type.model';
import { itemTypeModel } from './item-type.model';
import { userModel, IUser } from './user.model';

export interface IAttribute extends Types.Subdocument {
  value: string;
  type: Types.ObjectId;
  typeName: string;
}

export interface ILink extends Types.Subdocument {
  uri: string;
  description: string;
}

export interface IConfigurationItem extends Document, SchemaTimestampsConfig {
  name: string;
  type: Types.ObjectId;
  typeName: string;
  typeColor: string;
  attributes: IAttribute[];
  links: ILink[];
  responsibleUsers: IUser[];
}

const attributeSchema = new Schema<IAttribute>({
    type: {
        type: Types.ObjectId,
        required: true,
        ref: 'AttributeType',
        validate: {
          validator: (value: Types.ObjectId) => attributeTypeModel.findById(value).countDocuments()
            .then((docs: number) => Promise.resolve(docs > 0))
            .catch((error: any) => Promise.reject(error)),
          message: 'Attribute type with this id not found.',
        }
    },
    value: {
        type: String,
        required: true,
    },
    typeName: {
      type: String,
      required: true,
    },
}, {_id: false});

const linkSchema = new Schema<ILink>({
    uri: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {_id: false});

const configurationItemSchema = new Schema<IConfigurationItem, IConfigurationItemModel>({
  name: {
    type: String,
    required: true,
    unique: false,
    index: true,
  },
  type: {
    type: Types.ObjectId,
    required: true,
    ref: 'ItemType',
    validate: {
      validator: (value: Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
        .then((docs: number) => Promise.resolve(docs > 0))
        .catch((error: any) => Promise.reject(error)),
      message: 'item type with this id not found.',
    },
  },
  typeName: {
    type: String,
    required: true,
  },
  typeColor: {
    type: String,
    required: true,
  },
  attributes: [attributeSchema],
  links: [linkSchema],
  responsibleUsers: [{
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: (value: Types.ObjectId) => userModel.findById(value).countDocuments()
        .then((docs: number) => Promise.resolve(docs > 0))
        .catch((error: any) => Promise.reject(error)),
      message: 'user with this id not found',
    }
  }],
}, {
  timestamps: true
});

configurationItemSchema.index({name: 1, type: 1}, {unique: true});

configurationItemSchema.statics.validateIdExists = (value: Types.ObjectId) => configurationItemModel.findById(value).countDocuments()
  .then((docs: number) => Promise.resolve(docs > 0))
  .catch((error: any) => Promise.reject(error));

configurationItemSchema.statics.validateNameDoesNotExistWithItemType = async (name: string, type: string | Types.ObjectId) => {
  try {
    const count = await configurationItemModel.find({name, type}).countDocuments();
    return count === 0 ? Promise.resolve() : Promise.reject();
  } catch (err) {
      return Promise.reject(err);
  }
};

configurationItemSchema.statics.validateItemTypeUnchanged = async (_id: string, type: string) => {
  try {
    const count = await configurationItemModel.find({_id, type}).countDocuments();
    return count > 0 ? Promise.resolve() : Promise.reject();
  } catch (err) {
      return Promise.reject(err);
  }
};

export interface IConfigurationItemModel extends Model<IConfigurationItem> {
  validateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExistWithItemType(name: string, itemType: string | Types.ObjectId): Promise<void>;
  validateItemTypeUnchanged(itemId: string, itemType: string): Promise<void>;
}

export const configurationItemModel = model<IConfigurationItem, IConfigurationItemModel>('ConfigurationItem', configurationItemSchema);

