import {
  Schema,
  Document,
  Types,
  Model,
  model,
  SchemaTimestampsConfig,
  MongooseFilterQuery
} from 'mongoose';

import { attributeTypeModel, IAttributeType } from './attribute-type.model';
import { itemTypeModel, IItemType } from './item-type.model';
import { userModel, IUser } from './user.model';

export type ItemFilterConditions = MongooseFilterQuery<Pick<IConfigurationItem,
  '_id' | 'createdAt' | 'updatedAt' | 'currentTime' | 'name' | 'responsibleUsers' | 'attributes' | 'type' | 'links'>>;

interface IAttributeBase extends Types.Subdocument {
  value: string;
}

export interface IAttribute extends IAttributeBase {
  // [x: string]: any;
  type: IAttributeType['_id'];
}

export interface IAttributePopulated extends IAttributeBase {
  type: IAttributeType;
}

export interface ILink extends Types.Subdocument {
  uri: string;
  description: string;
}

interface IConfigurationItemBase extends Document, SchemaTimestampsConfig {
  name: string;
  attributes: IAttribute[];
  links: ILink[];
  responsibleUsers: IUser[];
}

export interface IConfigurationItem extends IConfigurationItemBase {
  type: IItemType['_id'];
}

export interface IConfigurationItemPopulated extends IConfigurationItemBase {
  type: IItemType;
}

const attributeSchema = new Schema({
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
});

const linkSchema = new Schema({
    uri: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const configurationItemSchema = new Schema({
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

configurationItemSchema.statics.validateIdExists = async (value: string | Types.ObjectId) => {
  try {
    const count = await configurationItemModel.findById(value).countDocuments();
    return count > 0 ? Promise.resolve() : Promise.reject();
  } catch (err) {
      return Promise.reject(err);
  }
};

configurationItemSchema.statics.mValidateIdExists = (value: Types.ObjectId) => configurationItemModel.findById(value).countDocuments()
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

// tslint:disable-next-line: variable-name
configurationItemSchema.statics.validateItemTypeUnchanged = async (_id: string, type: string) => {
  try {
    const count = await configurationItemModel.find({_id, type}).countDocuments();
    return count > 0 ? Promise.resolve() : Promise.reject();
  } catch (err) {
      return Promise.reject(err);
  }
};

export interface IConfigurationItemModel extends Model<IConfigurationItem> {
  validateIdExists(value: string): Promise<void>;
  mValidateIdExists(value: Types.ObjectId): Promise<boolean>;
  validateNameDoesNotExistWithItemType(name: string, itemType: string | Types.ObjectId): Promise<void>;
  validateItemTypeUnchanged(itemId: string, itemType: string): Promise<void>;
}

export const configurationItemModel = model<IConfigurationItem, IConfigurationItemModel>('ConfigurationItem', configurationItemSchema);

