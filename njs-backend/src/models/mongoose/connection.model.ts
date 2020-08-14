import { Schema, Document, Model, model } from 'mongoose';

import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { configurationItemModel, IConfigurationItem } from './configuration-item.model';
import { invalidConnectionRuleMsg, invalidItemTypeMsg } from '../../util/messages.constants';

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
        validate: {
            validator: connectionRuleModel.mValidateIdExists,
            message: invalidConnectionRuleMsg,
        },
    },
    upperItem: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
        validate: {
            validator: configurationItemModel.mValidateIdExists,
            message: invalidItemTypeMsg,
        }
    },
    lowerItem: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'ConfigurationItem',
        validate: {
            validator: configurationItemModel.mValidateIdExists,
            message: invalidItemTypeMsg,
        }
    },
    description: {
        type: String,
        required: false,
        default: '',
    }
});

export const connectionModel = model<IConnection>('Connection', connectionSchema);
