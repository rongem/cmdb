import mongoose, { Schema, Document } from 'mongoose';

interface IHistoricConnection extends Document {
    connectionRuleId: Schema.Types.ObjectId;
    connectionTypeId: Schema.Types.ObjectId;
    connectionTypeName: string;
    connectionTypeReverseName: string;
    upperItemId: Schema.Types.ObjectId;
    lowerItemId: Schema.Types.ObjectId;
    descriptions: string[];
    deleted: boolean;
}

const historicConnectionSchema = new Schema({
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

export default mongoose.model<IHistoricConnection>('historic_connections', historicConnectionSchema);
