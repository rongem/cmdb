import { MongooseFilterQuery } from 'mongoose';

import { HttpError } from '../../rest-api/httpError.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';
import { nameField, passphraseField } from '../../util/fields.constants';
import { UserInfo } from '../../models/item-data/user-info.model';
import { userCreationFailed } from '../../util/messages.constants';

export const salt = 15; // lower this value for faster authentication, or raise it for more security. You should not go lower than 12.

export function adjustFilterToAuthMode(filter: MongooseFilterQuery<Pick<IUser, '_id' | 'name' | 'role' | 'passphrase'>>) {
    const authMethod = endpointConfig.authMode();
    switch (authMethod) {
        case 'ntlm':
            // filter[passphraseField] = {$exists: false};
            break;
        case 'jwt':
            filter[passphraseField] = {$exists: true};
            break;
        default: // prevent other methods from working
            filter[nameField] = {$exists: false};
            break;
    }
    return filter;
}

export async function userModelCreate(name: string, role: number, passphrase?: string) {
    const user = await userModel.create({ name, role, passphrase, lastVisit: new Date(0) });
    if (!user) {
        throw new Error(userCreationFailed);
    }
    return new UserInfo(user);
}


