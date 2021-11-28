import { Schema, Document, Model, Types, model, SchemaTimestampsConfig } from 'mongoose';

export interface IHistoricConnection extends Document, SchemaTimestampsConfig {
    connectionRuleId: Types.ObjectId;
    connectionTypeId: Types.ObjectId;
    connectionTypeName: string;
    connectionTypeReverseName: string;
    upperItemId: Types.ObjectId;
    lowerItemId: Types.ObjectId;
    descriptions: Types.Array<string>;
    deleted: boolean;
}

const historicConnectionSchema = new Schema<IHistoricConnection,  Model<IHistoricConnection>>({
    connectionRuleId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    connectionTypeId: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        required: true,
    },
    lowerItemId: {
        type: Schema.Types.ObjectId,
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
