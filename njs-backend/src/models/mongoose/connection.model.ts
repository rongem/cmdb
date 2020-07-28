import mongoose, { Schema, Document } from 'mongoose';

import connectionTypeModel, { IConnectionType } from './connection-type.model';
import connectionRuleModel, { IConnectionRule } from './connection-rule.model';
import itemModel, { IConfigurationItem } from './configuration-item.model';

export interface IConnection extends Document {
    connectionRule: IConnectionRule['_id'];
    upperItem: IConfigurationItem['_id'];
    lowerItem: IConfigurationItem['_id'];
    description: string;
}

const connectionSchema = new Schema({
    connectionRule: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConnectionRule',
    },
    upperItem: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
    },
    lowerItem: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
    },
    description: {
        type: String,
        required: false,
        default: '',
    }
});

export default mongoose.model<IConnection>('Connection', connectionSchema);
