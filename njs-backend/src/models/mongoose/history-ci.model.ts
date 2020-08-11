import mongoose, { Schema, Document } from 'mongoose';

import { IConfigurationItem } from './configuration-item.model';

export interface IHistoryCi extends Document{
    oldVersions: IConfigurationItem[];
    deleted: boolean;
};

const attributeSchema = new Schema({
    typeId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    typeName: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});

const linkSchema = new Schema({
    uri: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

export const HistoricItemSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    typeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ItemType',
    },
    typeName: {
        type: String,
        required: true,
    },
    attributes: [attributeSchema],
    links: [linkSchema],
    responsibleUsers: [userSchema],
  }, {timestamps: true});
  

const historyCiSchema = new Schema({
    oldVersions: {
        type: [HistoricItemSchema],
        required: false,
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false,
    }
}, {timestamps: true})

export default mongoose.model<IHistoryCi>('HistoryCI', historyCiSchema);
