import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { ConnectionRule } from './objects/connection-rule.model';
import { ConnectionType } from './objects/connection-type.model';

import * as fromApp from './store/app.reducer';
import * as MetaDataActions from './store/meta-data.actions';
import { AttributeType } from './objects/attribute-type.model';

export enum UserRole {
    Reader = 0,
    Editor,
    Administrator,
}

@Injectable({providedIn: 'root'})
export class MetaDataService {
    private connectionRules: ConnectionRule[];
    private connectionTypes: ConnectionType[];
    private userName: string;
    private userRole: UserRole;
    constructor(private store: Store<fromApp.AppState>) {
        this.store.dispatch(new MetaDataActions.ReadState());
        this.store.select(fromApp.METADATA).subscribe(stateData => {
            this.connectionRules = stateData.connectionRules;
            this.connectionTypes = stateData.connectionTypes;
            this.userRole = stateData.userRole;
            this.userName = stateData.userName;
        });
    }

    getUserName() {
        return this.userName;
    }

    getUserRole() {
        switch (this.userRole) {
            case UserRole.Administrator:
                return 'Administrator';
            case UserRole.Editor:
                return 'Editor';
            default:
                return 'Reader';
        }
    }

    // Returns a list of ConnectionTypes that is enclosed in a given rule list
    getConnectionTypesForRules(rules: ConnectionRule[]) {
        return this.connectionTypes.filter(value =>
            rules.filter(rule => rule.ConnType === value.ConnTypeId).length > 0 );
    }

    // Returns all ConnectionRules that have the given upper ItemType
    getConnectionRulesToLowerForItem(guid: Guid) {
        return this.connectionRules.filter(value =>
            value.ItemUpperType === guid);
    }

    // Returns all ConnectionRules that have the given lower ItemType
    getConnectionRulesToUpperForItem(guid: Guid) {
        return this.connectionRules.filter(value =>
            value.ItemLowerType === guid);
    }
}
