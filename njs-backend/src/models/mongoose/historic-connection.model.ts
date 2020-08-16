import { Schema, Document, Model, Types, model, SchemaTimestampsConfig } from 'mongoose';

interface IHistoricConnectionSchema extends Document, SchemaTimestampsConfig {
    connectionRuleId: string;
    connectionTypeId: string;
    connectionTypeName: string;
    connectionTypeReverseName: string;
    upperItemId: string;
    lowerItemId: string;
    descriptions: Types.Array<string>;
    deleted: boolean;
}

const historicConnectionSchema = new Schema({
    connectionRuleId: {
        type: Types.ObjectId,
        required: true,
    },
    connectionTypeId: {
        type: Types.ObjectId,
        required: true,
    },
    connectionTypeName: {
        type: String,
        required: true,
    },
    connectionTypeReverseName: {
        type: String,
        required: true,
    },
    upperItemId: {
        type: Types.ObjectId,
        required: true,
    },
    lowerItemId: {
        type: Types.ObjectId,
        required: true,
    },
    descriptions: {
        type: [String],
        required: false,
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false,
    }
}, {timestamps: true});

export interface IHistoricConnection extends IHistoricConnectionSchema {}

export interface IHistoricConnectionModel extends Model<IHistoricConnection> {}

export const historicConnectionModel = model<IHistoricConnection, IHistoricConnectionModel>('historic_connections', historicConnectionSchema);
