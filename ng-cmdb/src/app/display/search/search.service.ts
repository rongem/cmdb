import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { SearchContent } from './search-content.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as SearchActions from './store/search.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { getUrl } from 'src/app/shared/store/functions';

@Injectable()
export class SearchService {
    metaData: Observable<fromMetaData.State>;
    searchContent = new SearchContent();
    searchContentChanged = new Subject<SearchContent>();
    searchForm: FormGroup;
    itemTypes: ItemType[];
    attributes: ItemAttribute[] = [];
    selectedAttributeTypes: Guid[] = [];
    attributeTypes: AttributeType[];
    connectionsToUpper = new FormArray([]);
    connectionsToLower = new FormArray([]);

    constructor(private store: Store<fromApp.AppState>,
                private http: HttpClient) {
        this.searchContent.Attributes = [];
        this.searchContent.ConnectionsToLower = [];
        this.searchContent.ConnectionsToUpper = [];
        this.metaData = this.store.select(fromApp.METADATA);
        this.metaData.subscribe(stateData => {
            this.attributeTypes = stateData.attributeTypes;
            this.itemTypes = stateData.itemTypes;
        });
        this.initForm();
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
        this.store.select(fromApp.METADATA).subscribe(
            (state: fromMetaData.State) => {
                this.attributeTypes = state.currentItemType.itemType ?
                    state.currentItemType.attributeTypes : state.attributeTypes;
                this.filterAttributes(((this.searchForm.get('Attributes') as FormArray).controls) as FormGroup[]);
        });
    }

    addItemType(itemType: ItemType) {
        this.searchForm.get('ItemType').enable();
        this.searchForm.get('ItemType').setValue(itemType.TypeId);
        this.store.dispatch(new MetaDataActions.SetCurrentItemType(itemType));
        this.searchForm.markAsDirty();
    }

    deleteItemType() {
        this.searchForm.get('ItemType').setValue(null);
        this.searchForm.get('ItemType').disable();
        this.searchForm.markAsDirty();
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

    addResponsibility(username: string) {
        this.searchForm.get('ResponsibleToken').enable();
        this.searchForm.get('ResponsibleToken').setValue(username);
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
        this.store.dispatch(new SearchActions.PerformSearch(searchForm));
    }

    getProposals(text: string) {
        return this.http.get<string[]>(getUrl('Proposals/' + text));
    }
}
