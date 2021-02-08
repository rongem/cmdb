import bcrypt from 'bcrypt';
import { MongooseFilterQuery } from 'mongoose';

import { UserInfo } from '../../models/item-data/user-info.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { notFoundError } from '../error.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { invalidRoleMsg, nothingChangedMsg, userCreationFailedMsg } from '../../util/messages.constants';
import { HttpError } from '../../rest-api/httpError.model';
import endpointConfig from '../../util/endpoint.config';

type UserFilter = MongooseFilterQuery<Pick<IUser, '_id' | 'name' | 'role' | 'passphrase'>>;

export const salt = endpointConfig.salt(); // lower this value for faster authentication, or raise it for more security. You should not go lower than 12.

export async function userModelFind(filter: UserFilter) {
    adjustFilterToAuthMode(filter);
    const users: IUser[] = await userModel.find(filter).sort('name');
    return users.map(u => new UserInfo(u));
}

export async function userModelFindAll() {
    const users: IUser[] = await userModel.find().sort('name');
    return users.map(u => new UserInfo(u));
}

export function createUserHandler(name: string, role: number, passphrase: string | undefined) {
    if (role < 0 || role > 2) {
        throw new HttpError(422, invalidRoleMsg);
    }
    if (passphrase) {
        name = name;
        return bcrypt.hash(passphrase, salt).then(password => userModelCreate(name, role, password));
    } else {
        return userModelCreate(name, role);
    }
}

export async function getUsersFromAccountNames(expectedUsers: string[], userId: string, authentication: IUser) {
    let responsibleUsers: IUser[] = await userModel.find({ name: { $in: expectedUsers } });
    const usersToDelete: number[] = [];
    expectedUsers.forEach((u, index) => {
      if (responsibleUsers.find(r => r.name === u)) {
        usersToDelete.push(index);
      }
    });
    usersToDelete.reverse().forEach(n => expectedUsers.splice(n, 1));
    if (expectedUsers.length > 0) { // tbd: creating new user accounts makes no sense when using jwt, only when using ntlm
      responsibleUsers = responsibleUsers.concat(await userModel.insertMany(expectedUsers.map(u => ({
        name: u,
        role: 0,
        lastVisit: new Date(0),
      }))));
    }
    if (!responsibleUsers.map(r => r.id).includes(userId)) {
      responsibleUsers.push(authentication);
    }
    return responsibleUsers;
  }


export function adjustFilterToAuthMode(filter: UserFilter) {
    const authMethod = endpointConfig.authMode();
    switch (authMethod) {
        case 'ntlm':
            // filter.passphrase = {$exists: false};
            break;
        case 'jwt':
            if (filter.name && typeof filter.name === 'string') {
                filter.name = filter.name.toLocaleLowerCase();
            }
            filter.passphrase = {$exists: true};
            break;
        default: // prevent other methods from working
            filter.name = {$exists: false};
            break;
    }
    return filter;
}

export async function userModelCreate(name: string, role: number, passphrase?: string) {
    const user = await userModel.create({ name, role, passphrase, lastVisit: new Date(0) });
    if (!user) {
        throw new HttpError(500, userCreationFailedMsg);
    }
    return new UserInfo(user);
}


export async function userModelUpdate(name: string, role: number, passphrase?: string) {
    if (role < 0 || role > 2) {
        throw new HttpError(422, invalidRoleMsg);
    }
    let filter: UserFilter = { name };
    filter = adjustFilterToAuthMode(filter);
    let user = await userModel.findOne(filter);
    if (!user) {
        throw notFoundError;
    }
    let changed = false;
    if (user.role !== role) {
        user.role = role;
        changed = true;
    }
    if (passphrase) {
        const isEqual = await bcrypt.compare(passphrase, user.passphrase!);
        if (!isEqual) {
            user.passphrase = await bcrypt.hash(passphrase, salt);
            changed = true;
        }
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    user = await user.save();
    return new UserInfo(user);
}

export async function userModelDelete(name: string, withResponsibilities: boolean) {
    let filter: UserFilter = { name };
    filter = adjustFilterToAuthMode(filter);
    let deleted = false;
    let user = await userModel.findOne(filter);
    if (!user) {
        throw notFoundError;
    }
    if (withResponsibilities) {
        configurationItemModel.updateMany(
            { responsibleUsers: [user._id] },
            { $pullAll: { responsibleUsers: user._id } }
        ).exec();
        deleted = true;
        user = await user.remove();
    } else {
        const docCount = await configurationItemModel.find({ responsibleUsers: [user._id] }).countDocuments();
        if (docCount > 0) {
            user.role = 0;
            user = await user.save();
        } else {
            deleted = true;
            user = await user.remove();
        }
    }
    return { user: new UserInfo(user), deleted };
}
