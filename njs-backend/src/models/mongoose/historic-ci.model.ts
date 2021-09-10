import { Schema, Document, Types, Model, model, SchemaTimestampsConfig } from 'mongoose';

interface IHistoricAttribute extends Document {
    typeId: string;
    typeName: string;
    value: string;
}

interface IHistoricLink extends Document {
    uri: string;
    description: string;
}

interface IHistoricUser extends Document {
    name: string;
}

export interface IHistoricCi extends Document, SchemaTimestampsConfig {
    oldVersions: Types.Array<{
        name: string;
        typeName: string;
        attributes: Types.Array<IHistoricAttribute>;
        links: Types.Array<IHistoricLink>;
        responsibleUsers: Types.Array<IHistoricUser>;
        lastUpdate: Date;
        savedBy: string;
    }>;
    typeId: string;
    typeName: string;
    deleted: boolean;
}

const attributeSchema = new Schema<IHistoricAttribute>({
    typeId: {
        type: Types.ObjectId,
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

const linkSchema = new Schema<IHistoricLink>({
    uri: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const userSchema = new Schema<IHistoricUser>({
    name: {
        type: String,
        required: true,
    }
});

const HistoricItemSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    typeName: {
        type: String,
        required: true,
    },
    attributes: [attributeSchema],
    links: [linkSchema],
    responsibleUsers: [userSchema],
    lastUpdate: {
        type: Date,
        required: true,
    },
    savedBy: {
        type: String,
        required: true,
    },
  }, {timestamps: true});

const historicCiSchema = new Schema<IHistoricCi, Model<IHistoricCi>>({
    typeId: {
        type: Types.ObjectId,
        required: true,
    },
    typeName: {
        type: String,
        required: true,
    },
    oldVersions: {
        type: [HistoricItemSchema],
        required: false,
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false,
    }
}, {timestamps: true});

export const historicCiModel = model<IHistoricCi, Model<IHistoricCi>>('Historic_CI', historicCiSchema);
