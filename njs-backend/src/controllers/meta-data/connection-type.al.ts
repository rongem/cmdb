import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { connectionTypeModel, IConnectionType } from '../../models/mongoose/connection-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { nameField } from '../../util/fields.constants';
import { disallowedDeletionOfConnectionTypeMsg, nothingChangedMsg } from '../../util/messages.constants';

export function connectionTypeModelFindAll(): Promise<ConnectionType[]> {
    return connectionTypeModel.find().sort(nameField)
        .then((connectionTypes: IConnectionType[]) => connectionTypes.map(ct => new ConnectionType(ct)));
}

export function connectionTypeModelFind(filter: any): Promise<ConnectionType[]> {
    return connectionTypeModel.find(filter).sort(nameField)
        .then((connectionTypes: IConnectionType[]) => connectionTypes.map(ct => new ConnectionType(ct)));
}

export async function connectionTypeModelFindSingle(id: string): Promise<ConnectionType> {
    const connectionType = await connectionTypeModel.findById(id);
    if (!connectionType) {
        throw notFoundError;
    }
    return new ConnectionType(connectionType);
}

export async function connectionTypeModelSingleExists(id: string) {
    const count: number = await connectionTypeModel.findById(id).countDocuments();
    return count > 0;
}

export async function connectionTypeModelCreate(name: string, reverseName: string) {
    return connectionTypeModel.create({name, reverseName})
        .then(connectionType => new ConnectionType(connectionType));
}

export async function connectionTypeModelUpdate(id: string, name: string, reverseName: string) {
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

export async function connectionTypeModelDelete(id: string) {
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
        throw new HttpError(422, disallowedDeletionOfConnectionTypeMsg);
    }
    connectionType = await connectionType.remove();
    return new ConnectionType(connectionType);
}

export async function connectionTypeModelCanDelete(id: string) {
    const rulesCount: number = await connectionRuleModel.find({ connectionType: id }).countDocuments();
    return rulesCount === 0;
}
