import mongoose, { Schema, Document } from 'mongoose';

import { IAttributeType } from './attribute-type.model';
import { IItemType } from './item-type.model';

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
  responsibleUsers: string[];
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
  },
  lastChange: {
    type: Date,
    required: true,
  },
  attributes: [attributeSchema],
  links: [linkSchema],
  responsibleUsers: [String],
});

export default mongoose.model<IConfigurationItem>('ConfigurationItem', configurationItemSchema);
