import { connectionRuleModel } from '../../mongoose/connection-rule.model';
import { connectionTypeModel, IConnectionType } from '../../mongoose/connection-type.model';
import { ConnectionType } from '../../meta-data/connection-type.model';
import { notFoundError } from '../../../controllers/error.controller';
import { HttpError } from '../../../rest-api/httpError.model';
import { disallowedDeletionOfConnectionTypeMsg, nothingChangedMsg } from '../../../util/messages.constants';

export const connectionTypeModelFindAll = async (): Promise<ConnectionType[]> => {
    const connectionTypes = await connectionTypeModel.find().sort('name');
    return connectionTypes.map(ct => new ConnectionType(ct));
}

export const connectionTypeModelFind = async (filter: any): Promise<ConnectionType[]> => {
    const connectionTypes = await connectionTypeModel.find(filter).sort('name');
    return connectionTypes.map(ct => new ConnectionType(ct));
}

export const connectionTypeModelFindSingle = async (id: string): Promise<ConnectionType> => {
    const connectionType = await connectionTypeModel.findById(id);
    if (!connectionType) {
        throw notFoundError;
    }
    return new ConnectionType(connectionType);
}

export const connectionTypeModelSingleExists = async (id: string) => {
    const count: number = await connectionTypeModel.findById(id).countDocuments();
    return count > 0;
}

export const connectionTypeModelValidateIdExists = async (value: string) => {
    try {
        const count = await connectionTypeModel.findById(value).countDocuments();
        return count > 0 ? Promise.resolve() : Promise.reject();
    }
    catch (err) {
        return Promise.reject(err);
    }
};

export const connectionTypeModelCreate = async (name: string, reverseName: string) => {
    return connectionTypeModel.create({name, reverseName})
        .then(connectionType => new ConnectionType(connectionType));
}

export const connectionTypeModelUpdate = async (id: string, name: string, reverseName: string) => {
    let connectionType = await connectionTypeModel.findById(id);
    if (!connectionType) {
        throw notFoundError;
    }
    let changed = false;
    if (connectionType.name !== name) {
        connectionType.name = name;
        changed = true;
    }
    if (connectionType.reverseName !== reverseName) {
        connectionType.reverseName = reverseName;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    connectionType = await connectionType.save();
    return new ConnectionType(connectionType);
}

export const connectionTypeModelDelete = async (id: string) => {
    let connectionType: IConnectionType | null;
    let canDelete: boolean;
    [connectionType, canDelete] = await Promise.all([
        connectionTypeModel.findById(id),
        connectionTypeModelCanDelete(id)
    ]);
    if (!connectionType) {
        throw notFoundError;
    }
    if (!canDelete) {
        throw new HttpError(400, disallowedDeletionOfConnectionTypeMsg);
    }
    connectionType = await connectionType.remove();
    return new ConnectionType(connectionType);
}

export const connectionTypeModelCanDelete = async (id: string) => {
    const rulesCount: number = await connectionRuleModel.find({ connectionType: id }).countDocuments();
    return rulesCount === 0;
}
