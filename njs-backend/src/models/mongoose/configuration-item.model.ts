import mongoose, { Schema, Document } from 'mongoose';

import attributeTypeModel, { IAttributeType } from './attribute-type.model';
import itemTypeModel, { IItemType } from './item-type.model';
import userModel, { IUser } from './user.model';

export interface IAttribute extends Document {
  name: string;
  type: IAttributeType['_id'];
  value: string;
  lastChange: Date;
}

export interface ILink extends Document {
  uri: string;
  description: string;
}

export interface IConfigurationItem extends Document {
  name: string;
  type: IItemType['_id'];
  lastChange: Date;
  attributes: IAttribute[];
  links: ILink[];
  responsibleUsers: IUser[];
}

const attributeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AttributeType',
        validate: {
          validator: (value: Schema.Types.ObjectId) => attributeTypeModel.findById(value).countDocuments()
            .then(docs => Promise.resolve(docs > 0))
            .catch(error => Promise.reject(error)),
          message: 'Attribute type with this id not found.',
        }
    },
    value: {
        type: String,
        required: true,
    },
    lastChange: {
        type: Date,
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
    unique: true,
    index: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ItemType',
    validate: {
      validator: (value: Schema.Types.ObjectId) => itemTypeModel.findById(value).countDocuments()
        .then(docs => Promise.resolve(docs > 0))
        .catch(error => Promise.reject(error)),
      message: 'item type with this id not found.',
    },
  },
  lastChange: {
    type: Date,
    required: true,
  },
  attributes: [attributeSchema],
  links: [linkSchema],
  responsibleUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: (value: Schema.Types.ObjectId) => userModel.findById(value).countDocuments()
        .then(docs => Promise.resolve(docs > 0))
        .catch(error => Promise.reject(error)),
      message: 'user with this id not found',
    }
  }],
}, {
  timestamps: true
});

export default mongoose.model<IConfigurationItem>('ConfigurationItem', configurationItemSchema);
