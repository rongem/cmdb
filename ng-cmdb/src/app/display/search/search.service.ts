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

@Injectable()
export class SearchService {
    private searchableAttributeTypes: AttributeType[] = [];
    private resultList: ConfigurationItem[] = [];
    resultListChanged: Subject<ConfigurationItem[]> = new Subject<ConfigurationItem[]>();
    resultListPresent = false;
    visibilityChanged = new Subject<boolean>();
    private visibilityState = false;
    searchContent = new SearchContent();
    searchForm: FormGroup;
    itemTypeName = '';
    attributes: ItemAttribute[] = [];
    connectionsToUpper = new FormArray([]);
    connectionsToLower = new FormArray([]);
    useItemType = true;
    itemTypes: ItemType[];
    attributeTypes: AttributeType[];
    selectedAttributeTypes: Guid[] = [];
    private itemTypesSubscription: Subscription;
    private attributeTypesSubscription: Subscription;

    constructor(private meta: MetaDataService,
                private data: DataAccessService) {
        this.searchContent.Attributes = [];
        this.searchContent.ConnectionsToLower = [];
        this.searchContent.ConnectionsToUpper = [];
        this.attributeTypesSubscription = this.meta.attributeTypesChanged.subscribe(
            (attributeTypes: AttributeType[]) => {
              this.attributeTypes = attributeTypes;
            }
        );
        this.itemTypesSubscription = this.meta.itemTypesChanged.subscribe(
            (itemTypes: ItemType[]) => {
            this.itemTypes = itemTypes;
        });
        this.attributeTypes = this.meta.getAttributeTypes();
        this.itemTypes = this.meta.getItemTypes();
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
        }
        if (this.searchContent.ResponsibleToken === undefined) {
            this.searchForm.get('ResponsibleToken').disable();
        }
        for (const attribute of this.searchContent.Attributes) {
            this.addAttributeType(attribute.attributeTypeId, attribute.attributeValue);
        }
        for (const connection of this.searchContent.ConnectionsToLower) {}
        for (const connection of this.searchContent.ConnectionsToUpper) {}
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
        this.data.fetchAttributeTypesForItemType(itemType.TypeId).subscribe((attributeTypes: AttributeType[]) => {
          this.attributeTypes = attributeTypes;
          this.filterAttributes(((this.searchForm.get('Attributes') as FormArray).controls) as FormGroup[]);
        });
        this.searchForm.markAsTouched();
    }

    deleteItemType() {
        this.searchForm.get('ItemType').setValue(null);
        this.searchForm.get('ItemType').disable();
        this.searchForm.markAsTouched();
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
        this.searchForm.markAsTouched();
    }

    deleteAttributeType(index: number) {
        this.selectedAttributeTypes.splice(index, 1);
        (this.searchForm.get('Attributes') as FormArray).removeAt(index);
        this.searchForm.markAsTouched();
    }

    getAttributeControls() {
        return (this.searchForm.get('Attributes') as FormArray).controls;
    }

    getAttributeTypeName(formGroup: FormGroup) {
        return this.meta.getAttributeType(formGroup.controls.AttributeTypeId.value).TypeName;
    }

    addResponsibility() {
        this.searchForm.get('ResponsibleToken').enable();
        this.searchForm.get('ResponsibleToken').setValue(this.meta.userName);
        this.searchForm.markAsTouched();
    }

    deleteResponsibility() {
        this.searchForm.get('ResponsibleToken').setValue(null);
        this.searchForm.get('ResponsibleToken').disable();
        this.searchForm.markAsTouched();
    }

    responsibilityEnabled() {
        return this.searchForm.get('ResponsibleToken').enabled;
    }

    search(searchForm: SearchContent) {
        const searchSubscription = this.data.searchItems(searchForm).subscribe((foundItems: ConfigurationItem[]) => {
            if (foundItems) {
                this.resultList = foundItems;
                this.resultListPresent = true;
            } else {
                this.resultList = [];
                this.resultListPresent = false;
            }
            this.resultListChanged.next(this.resultList.slice());
            searchSubscription.unsubscribe();
        });
    }

    getResultList() {
        return this.resultList.slice();
    }
}
