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

interface IHistoricCiSchema extends Document, SchemaTimestampsConfig {
    oldVersions: Types.Array<{
        name: string;
        typeName: string;
        attributes: Types.Array<IHistoricAttribute>;
        links: Types.Array<IHistoricLink>;
        responsibleUsers: Types.Array<IHistoricUser>;
        lastUpdate: Date;
    }>;
    typeId: string;
    typeName: string;
    deleted: boolean;
}

const attributeSchema = new Schema({
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

const userSchema = new Schema({
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
  }, {timestamps: true});

const historicCiSchema = new Schema({
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

// tslint:disable-next-line: no-empty-interface
export interface IHistoricCi extends IHistoricCiSchema {}

export interface IHistoricCiModel extends Model<IHistoricCi> {}

export const historicCiModel = model<IHistoricCi, IHistoricCiModel>('Historic_CI', historicCiSchema);
