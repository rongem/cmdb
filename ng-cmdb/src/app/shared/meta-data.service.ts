import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import { AttributeGroup } from './objects/attribute-group.model';
import { AttributeType } from './objects/attribute-type.model';
import { ConnectionRule } from './objects/connection-rule.model';
import { ConnectionType } from './objects/connection-type.model';
import { ItemType } from './objects/item-type.model';
import { AppState, METADATA } from './store/app-state.interface';
import { Observable } from 'rxjs';

export enum UserRole {
    Reader = 0,
    Editor,
    Administrator,
}

@Injectable({providedIn: 'root'})
export class MetaDataService {
    private attributeGroups: AttributeGroup[];
    private attributeTypes: AttributeType[];
    private connectionRules: ConnectionRule[];
    private connectionTypes: ConnectionType[];
    private itemTypes: ItemType[];
    private userName: string;
    private userRole: UserRole;
    constructor(private store: Store<AppState>) {
        this.store.select(METADATA).subscribe(stateData => {
            this.attributeGroups = stateData.attributeGroups;
            this.attributeTypes = stateData.attributeTypes;
            this.connectionRules = stateData.connectionRules;
            this.connectionTypes = stateData.connectionTypes;
            this.itemTypes = stateData.itemTypes;
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

    // Returns a single ItemType for the given id
    getItemType(id: Guid): ItemType {
        return this.itemTypes.find(t => t.TypeId === id);
    }

    // Returns a single AttributeType for the given id
    getAttributeType(id: Guid): AttributeType {
        return this.attributeTypes.find(t => t.TypeId === id);
    }

     // Returns a single ConnectionType for the given id
     getConnectionType(guid: Guid): ConnectionType {
        return this.connectionTypes.find(t => t.ConnTypeId === guid);
    }

    // Returns a list of ConnectionTypes that is enclosed in a given rule list
    getConnectionTypesForRules(rules: ConnectionRule[]) {
        return this.connectionTypes.filter(value =>
            rules.filter(rule => rule.ConnType === value.ConnTypeId).length > 0 );
    }

    // Returns a single ConnectionType for the given id
    getConnectionRule(guid: Guid): ConnectionRule {
        return this.connectionRules.find(rule => rule.RuleId === guid);
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
