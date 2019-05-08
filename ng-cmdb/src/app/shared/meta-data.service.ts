import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Guid } from 'guid-typescript';

import { ItemType } from './objects/item-type.model';
import { AttributeType } from './objects/attribute-type.model';
import { AttributeGroup } from './objects/attribute-group.model';
import { ConnectionType } from './objects/connection-type.model';
import { ConnectionRule } from './objects/connection-rule.model';

export enum UserRole {
    Reader = 0,
    Editor,
    Administrator,
}

@Injectable()
export class MetaDataService {

    userName: string;
    userRole: UserRole;
    private attributeGroups: AttributeGroup[] = [];
    private attributeTypes: AttributeType[] = [];
    private itemTypes: ItemType[] = [];
    private connectionTypes: ConnectionType[] = [];
    private connectionRules: ConnectionRule[] = [];
    attributeGroupsChanged = new Subject<AttributeGroup[]>();
    attributeTypesChanged = new Subject<AttributeType[]>();
    itemTypesChanged = new Subject<ItemType[]>();
    connectionTypesChanged = new Subject<ConnectionType[]>();
    connectionRulesChanged = new Subject<ConnectionRule[]>();

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

    setItemTypes(itemTypes: ItemType[]) {
        this.itemTypes = itemTypes;
        this.itemTypesChanged.next(this.itemTypes.slice());
    }

    getItemTypes(): ItemType[] {
        return this.itemTypes.slice();
    }

    getItemType(id: Guid): ItemType {
        for (const itemType of this.itemTypes) {
            if (itemType.TypeId === id) {
                return itemType;
            }
        }
    }

    setAttributeGroups(attributeGroups: AttributeGroup[]) {
        this.attributeGroups = attributeGroups;
        this.attributeGroupsChanged.next(this.attributeGroups.slice());
    }

    setAttributeTypes(attributeTypes: AttributeType[]) {
        this.attributeTypes = attributeTypes;
        this.attributeTypesChanged.next(this.attributeTypes.slice());
    }

    getAttributeTypes(): AttributeType[] {
        return this.attributeTypes.slice();
    }

    getAttributeType(id: Guid): AttributeType {
        for (const attributeType of this.attributeTypes) {
            if (attributeType.TypeId === id) {
                return attributeType;
            }
        }
    }

    setConnectionTypes(connectionTypes: ConnectionType[]) {
        this.connectionTypes = connectionTypes;
        this.connectionTypesChanged.next(this.connectionTypes.slice());
    }

    getConnectionTypes(): ConnectionType[] {
        return this.connectionTypes.slice();
    }

    getConnectionType(guid: Guid): ConnectionType {
        for (const connectionType of this.connectionTypes) {
            if (connectionType.ConnTypeId === guid) {
                return connectionType;
            }
        }
    }

    getConnectionRules(): ConnectionRule[] {
        return this.connectionRules.slice();
    }

    getConnectionRule(guid: Guid): ConnectionRule {
        for (const connectionRule of this.connectionRules) {
            if (connectionRule.RuleId === guid) {
                return connectionRule;
            }
        }
    }

    setConnectionRules(connectionRules: ConnectionRule[]) {
        this.connectionRules = connectionRules;
        this.connectionRulesChanged.next(this.connectionRules.slice());
    }
}
