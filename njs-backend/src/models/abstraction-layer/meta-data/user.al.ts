import bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';

import { UserAccount } from '../../item-data/user-account.model';
import { IUser, userModel } from '../../mongoose/user.model';
import { notFoundError } from '../../../controllers/error.controller';
import { configurationItemModel } from '../../mongoose/configuration-item.model';
import { invalidAuthentication, invalidRoleMsg, nothingChangedMsg, userCreationFailedMsg } from '../../../util/messages.constants';
import { HttpError } from '../../../rest-api/httpError.model';
import endpointConfig from '../../../util/endpoint.config';
import { configurationItemsCount } from '../item-data/configuration-item.al';

export const salt = endpointConfig.salt(); // lower this value for faster authentication, or raise it for more security. You should not go lower than 12.

export async function userModelFind(filter: FilterQuery<IUser>) {
    adjustFilterToAuthMode(filter);
    const users: IUser[] = await userModel.find(filter).sort('name');
    return users.map(u => new UserAccount(u));
}

export async function userModelFindByName(name: string) {
    const filter = { name };
    adjustFilterToAuthMode(filter);
    const user = await userModel.findOne(filter);
    return user ? new UserAccount(user) : undefined;
}

export async function userModelCheckCredentials(name: string, passphrase: string) {
    const filter = { name };
    adjustFilterToAuthMode(filter);
    const user = await userModel.findOne(filter);
    if (!user) {
        throw new Error(invalidAuthentication);
    }
    return { user: new UserAccount(user), result: bcrypt.compareSync(passphrase, user.passphrase!) };
}


export function userModelFindAndCount(filter: FilterQuery<IUser>) {
    adjustFilterToAuthMode(filter);
    return userModel.find(filter).countDocuments();
}

export async function userModelFindAll() {
    const users: IUser[] = await userModel.find().sort('name');
    return users.map(u => new UserAccount(u));
}

export const userModelValidateNameDoesNotExist = async (name: string) => {
    try {
      const count = await userModel.find({name}).countDocuments();
      return count === 0 ? Promise.resolve() : Promise.reject();
    } catch (err) {
      return Promise.reject(err);
    }
};

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

export async function getUsersFromAccountNames(expectedUsers: string[], userId: string, authentication: UserAccount) {
    let responsibleUsers: UserAccount[] = (await userModel.find({ name: { $in: expectedUsers } })).map(u => new UserAccount(u));
    const usersToDelete: number[] = [];
    expectedUsers.forEach((u, index) => {
    if (responsibleUsers.find(r => r.accountName === u)) {
        usersToDelete.push(index);
    }
    });
    usersToDelete.reverse().forEach(n => expectedUsers.splice(n, 1));
    if (endpointConfig.authMode() === 'ntlm' && expectedUsers.length > 0) {
        // creating new user accounts makes no sense when using jwt, only when using ntlm
        responsibleUsers = responsibleUsers.concat((await userModel.insertMany(expectedUsers.map(name => ({
            name,
            role: 0,
            lastVisit: new Date(0),
    })))).map(u => new UserAccount(u)));
    }
    if (!responsibleUsers.map(r => r.id).includes(userId)) {
        responsibleUsers.push(authentication);
    }
    return responsibleUsers;
}

function adjustFilterToAuthMode(filter: FilterQuery<IUser>) {
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
    return new UserAccount(user);
}

export async function userModelLogLastVisit(name: string, fixRole: boolean) {
    const updateQuery: {lastVisit: Date, role?: number} = {
        lastVisit: new Date()
    };
    if (fixRole) {
        updateQuery.role = 0;
    }
    userModel.updateOne({ name }, updateQuery).exec(); // log last visit and eventually change role
}

export async function userModelUpdate(name: string, role: number, passphrase?: string) {
    if (role < 0 || role > 2) {
        throw new HttpError(422, invalidRoleMsg);
    }
    let filter: FilterQuery<IUser> = { name };
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
        const isEqual = bcrypt.compareSync(passphrase, user.passphrase!);
        if (!isEqual) {
            user.passphrase = bcrypt.hashSync(passphrase, salt);
            changed = true;
        }
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    user = await user.save();
    return new UserAccount(user);
}

export async function userModelDelete(name: string, withResponsibilities: boolean) {
    let filter: FilterQuery<IUser> = { name };
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
        const docCount = await configurationItemsCount({ responsibleUsers: [user._id] });
        if (docCount > 0) {
            user.role = 0;
            user = await user.save();
        } else {
            deleted = true;
            user = await user.remove();
        }
    }
    return { user: new UserAccount(user), deleted };
}
