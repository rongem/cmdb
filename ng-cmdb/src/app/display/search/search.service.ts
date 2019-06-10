import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Subscription, Subject } from 'rxjs';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { SearchContent } from './search-content.model';
import { DataAccessService } from 'src/app/shared/data-access.service';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { take } from 'rxjs/operators';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { Store } from '@ngrx/store';
import { AppState, METADATA } from 'src/app/shared/store/app-state.interface';

@Injectable()
export class SearchService {
    private searchableAttributeTypes: AttributeType[] = [];
    private resultList: ConfigurationItem[] = [];
    resultListChanged: Subject<ConfigurationItem[]> = new Subject<ConfigurationItem[]>();
    resultListPresent = false;
    visibilityChanged = new Subject<boolean>();
    private visibilityState = false;
    searchContent = new SearchContent();
    searchContentChanged = new Subject<SearchContent>();
    searchForm: FormGroup;
    itemTypeName = '';
    useItemType = true;
    itemTypes: ItemType[];
    attributes: ItemAttribute[] = [];
    selectedAttributeTypes: Guid[] = [];
    attributeTypes: AttributeType[];
    connectionsToUpper = new FormArray([]);
    connectionsToLower = new FormArray([]);
    connectionTypesToUpper: ConnectionType[] = [];
    connectionTypesToLower: ConnectionType[] = [];
    connectionTypesToUpperChanged = new Subject<ConnectionType[]>();
    connectionTypesToLowerChanged = new Subject<ConnectionType[]>();
    connectionRulesToUpper: ConnectionRule[] = [];
    connectionRulesToLower: ConnectionRule[] = [];
    connectionRulesToUpperChanged = new Subject<ConnectionRule[]>();
    connectionRulesToLowerChanged = new Subject<ConnectionRule[]>();

    constructor(private meta: MetaDataService,
                private store: Store<AppState>,
                private data: DataAccessService) {
        this.searchContent.Attributes = [];
        this.searchContent.ConnectionsToLower = [];
        this.searchContent.ConnectionsToUpper = [];
        this.store.select(METADATA).subscribe(stateData => {
            this.attributeTypes = stateData.attributeTypes;
            this.itemTypes = stateData.itemTypes;
        });
        this.initializeConnectionRules();
        this.initForm();
    }

    private initializeConnectionRules() {
        this.connectionRulesToLower = [];
        this.connectionRulesToLowerChanged.next(this.connectionRulesToLower.slice());
        this.connectionRulesToUpper = [];
        this.connectionRulesToUpperChanged.next(this.connectionRulesToUpper.slice());
    }

    initForm() {
        this.selectedAttributeTypes = [];
        this.searchForm = new FormGroup({
          NameOrValue: new FormControl(this.searchContent.NameOrValue),
          ItemType: new FormControl(this.searchContent.ItemType),
          Attributes: new FormArray([]),
          ConnectionsToUpper: new FormArray([]),
          ConnectionsToLower: new FormArray([]),
          ResponsibleToken: new FormControl(this.searchContent.ResponsibleToken),
        });
        if (this.searchContent.ItemType === undefined) {
          this.searchForm.get('ItemType').disable();
          for (const connection of this.searchContent.ConnectionsToLower) {
              this.addConnectionToLower(connection.ConnectionType, connection.ConfigurationItemType, connection.Count);
          }
          for (const connection of this.searchContent.ConnectionsToUpper) {
            this.addConnectionToUpper(connection.ConnectionType, connection.ConfigurationItemType, connection.Count);
          }
        }
        if (this.searchContent.ResponsibleToken === undefined) {
            this.searchForm.get('ResponsibleToken').disable();
        }
        for (const attribute of this.searchContent.Attributes) {
            this.addAttributeType(attribute.attributeTypeId, attribute.attributeValue);
        }
    }

    getVisibilityState() {
        return this.visibilityState;
    }

    setVisibilityState(state: boolean) {
        this.visibilityState = state;
        this.visibilityChanged.next(this.visibilityState);
    }

    addItemType(itemType: ItemType) {
        this.searchForm.get('ItemType').enable();
        this.searchForm.get('ItemType').setValue(itemType.TypeId);
        this.itemTypeName = itemType.TypeName;
        this.data.fetchAttributeTypesForItemType(itemType.TypeId).subscribe(
            (attributeTypes: AttributeType[]) => {
            this.attributeTypes = attributeTypes;
            this.filterAttributes(((this.searchForm.get('Attributes') as FormArray).controls) as FormGroup[]);
        });
        const guid = this.searchForm.get('ItemType').value as Guid;
        this.connectionRulesToLower = this.meta.getConnectionRulesToLowerForItem(guid);
        this.connectionRulesToUpper = this.meta.getConnectionRulesToUpperForItem(guid);
        this.initializeConnections();
        this.searchForm.markAsDirty();
    }

    deleteItemType() {
        this.searchForm.get('ItemType').setValue(null);
        this.searchForm.get('ItemType').disable();
        this.connectionRulesToLower = [];
        this.connectionTypesToLowerChanged.next(this.connectionTypesToLower.slice());
        this.connectionRulesToUpper = [];
        this.connectionTypesToUpperChanged.next(this.connectionTypesToUpper.slice());
        this.searchForm.markAsDirty();
    }

    private initializeConnections() {
        if (this.itemTypeEnabled()) {
            this.connectionTypesToLower = this.meta.getConnectionTypesForRules(this.connectionRulesToLower);
            this.connectionTypesToUpper = this.meta.getConnectionTypesForRules(this.connectionRulesToUpper);
            this.connectionTypesToUpperChanged.next(this.connectionTypesToUpper.slice());
            this.connectionTypesToLowerChanged.next(this.connectionTypesToLower.slice());
        }
    }

    itemTypeEnabled() {
        return this.searchForm.get('ItemType').enabled;
    }

    attributesPresent() {
        return (this.searchForm.get('Attributes') as FormArray).length !== 0;
    }

    private attributeTypePresent(id: Guid): boolean {
        for (const attributeType of this.attributeTypes) {
            if (attributeType.TypeId === id) {
                return true;
            }
        }
    }

    attributeTypesAvailable() {
        return this.attributeTypes.length > this.selectedAttributeTypes.length;
    }

    private filterAttributes(attributes: FormGroup[]) {
        const posToDelete: number[] = [];
        for (const attribute of attributes) {
            const typeId = attribute.get('AttributeTypeId').value as Guid;
            if (!this.attributeTypePresent(typeId)) {
                posToDelete.push(attributes.indexOf(attribute));
                if (this.selectedAttributeTypes.includes(typeId)) {
                    this.selectedAttributeTypes.splice(this.selectedAttributeTypes.indexOf(typeId), 1);
                }
            }
        }
        posToDelete.reverse();
        for (const pos of posToDelete) {
            attributes.splice(pos, 1);
        }
    }

    addAttributeType(attributeTypeId: Guid, attributeValue?: string) {
        this.selectedAttributeTypes.push(attributeTypeId);
        (this.searchForm.get('Attributes') as FormArray).push(new FormGroup({
          AttributeTypeId: new FormControl(attributeTypeId, Validators.required),
          AttributeValue: new FormControl(attributeValue ? attributeValue : null),
        }));
        this.searchForm.markAsDirty();
    }

    deleteAttributeType(index: number) {
        this.selectedAttributeTypes.splice(index, 1);
        (this.searchForm.get('Attributes') as FormArray).removeAt(index);
        this.searchForm.markAsDirty();
    }

    getAttributeControls() {
        return (this.searchForm.get('Attributes') as FormArray).controls;
    }

    getAttributeTypeName(formGroup: FormGroup) {
        return this.meta.getAttributeType(formGroup.controls.AttributeTypeId.value).TypeName;
    }

    getItemTypesToUpperForConnectionType(connTypeId: Guid) {
        const itemTypes: ItemType[] = [];
        for (const itemType of this.itemTypes) {
            if (this.connectionRulesToUpper.filter((value: ConnectionRule) =>
                value.ConnType === connTypeId &&
                value.ItemUpperType === itemType.TypeId).length > 0) {
                    itemTypes.push(itemType);
                }
            }
        return itemTypes;
    }

    getItemTypesToLowerForConnectionType(connTypeId: Guid) {
        const itemTypes: ItemType[] = [];
        for (const itemType of this.itemTypes) {
            if (this.connectionRulesToLower.filter((value: ConnectionRule) =>
                value.ConnType === connTypeId &&
                value.ItemLowerType === itemType.TypeId).length > 0) {
                    itemTypes.push(itemType);
                }
            }
        return itemTypes;
    }

    connectionsToUpperPresent() {
        return (this.searchForm.get('ConnectionsToUpper') as FormArray).length !== 0;
    }

    connectionsToLowerPresent() {
        return (this.searchForm.get('ConnectionsToLower') as FormArray).length !== 0;
    }

    getConnectionsToUpperControls() {
        return (this.searchForm.get('ConnectionsToUpper') as FormArray).controls;
    }

    getConnectionsToLowerControls() {
        return (this.searchForm.get('ConnectionsToLower') as FormArray).controls;
    }

    getConnectionTypeName(formGroup: FormGroup) {
        return this.meta.getConnectionType(formGroup.controls.ConnectionType.value).ConnTypeName;
    }

    getConnectionTypeReverseName(formGroup: FormGroup) {
        return this.meta.getConnectionType(formGroup.controls.ConnectionType.value).ConnTypeReverseName;
    }

    getItemTypeName(formGroup: FormGroup) {
        if (formGroup.controls.ConfigurationItemType.value) {
            return this.meta.getItemType(formGroup.controls.ConfigurationItemType.value).TypeName;
        }
        return 'beliebigen Typ';
    }

    addConnectionToUpper(connType: Guid, itemType?: Guid, count?: string) {
        if (!count) { count = '1'; }
        (this.searchForm.get('ConnectionsToUpper') as FormArray).push(new FormGroup({
            ConnectionType: new FormControl(connType),
            ConfigurationItemType: new FormControl(itemType),
            Count: new FormControl(count),
        }));
        this.searchForm.markAsDirty();
    }

    addConnectionToLower(connType: Guid, itemType?: Guid, count?: string) {
        if (!count) { count = '1'; }
        (this.searchForm.get('ConnectionsToLower') as FormArray).push(new FormGroup({
            ConnectionType: new FormControl(connType),
            ConfigurationItemType: new FormControl(itemType),
            Count: new FormControl('1'),
        }));
        this.searchForm.markAsDirty();
    }

    deleteConnectionToUpper(index: number) {
        (this.searchForm.get('ConnectionsToUpper') as FormArray).removeAt(index);
        this.searchForm.markAsDirty();
    }

    deleteConnectionToLower(index: number) {
        (this.searchForm.get('ConnectionsToLower') as FormArray).removeAt(index);
        this.searchForm.markAsDirty();
    }

    addResponsibility() {
        this.searchForm.get('ResponsibleToken').enable();
        this.searchForm.get('ResponsibleToken').setValue(this.meta.getUserName());
        this.searchForm.markAsDirty();
    }

    deleteResponsibility() {
        this.searchForm.get('ResponsibleToken').setValue(null);
        this.searchForm.get('ResponsibleToken').disable();
        this.searchForm.markAsDirty();
    }

    responsibilityEnabled() {
        return this.searchForm.get('ResponsibleToken').enabled;
    }

    search(searchForm: SearchContent) {
        this.data.searchItems(searchForm)
            .pipe(take(1))
            .subscribe((foundItems: ConfigurationItem[]) => {
                if (foundItems && foundItems.length > 0) {
                    this.resultList = foundItems;
                    this.resultListPresent = true;
                } else {
                    this.resultList = [];
                    this.resultListPresent = false;
                }
                this.resultListChanged.next(this.resultList.slice());
            });
    }

    getResultList() {
        return this.resultList.slice();
    }
}
