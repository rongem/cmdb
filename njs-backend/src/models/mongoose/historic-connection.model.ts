import { Schema, Document, Model, Types, model, SchemaTimestampsConfig } from 'mongoose';

export interface IHistoricConnection extends Document, SchemaTimestampsConfig {
    connectionRuleId: string;
    connectionTypeId: string;
    connectionTypeName: string;
    connectionTypeReverseName: string;
    upperItemId: string;
    lowerItemId: string;
    descriptions: Types.Array<string>;
    deleted: boolean;
}

const historicConnectionSchema = new Schema<IHistoricConnection,  Model<IHistoricConnection>>({
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

export const historicConnectionModel = model<IHistoricConnection,  Model<IHistoricConnection>>('Historic_Connection', historicConnectionSchema);
