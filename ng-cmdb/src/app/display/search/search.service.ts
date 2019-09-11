import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Guid } from 'src/app/shared/guid';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { getUrl } from 'src/app/shared/store/functions';

@Injectable({providedIn: 'root'})
export class SearchService {
    metaData: Observable<fromMetaData.State>;
    searchForm: FormGroup;
    attributes: ItemAttribute[] = [];
    connectionsToUpper = new FormArray([]);
    connectionsToLower = new FormArray([]);

    constructor(private store: Store<fromApp.AppState>,
                private actions$: Actions,
                private http: HttpClient) {
        this.metaData = this.store.select(fromApp.METADATA);
        this.initForm();
        this.actions$.pipe(
            ofType(DisplayActions.searchAddItemType),
            switchMap(value =>
                this.store.pipe(select(fromSelectMetaData.selectAttributeTypesForItemType,
                    value.itemTypeId)),
            ),
            withLatestFrom(this.store.pipe(select(fromSelectDisplay.selectSearchUsedAttributeTypes))),
        ).subscribe((value: [AttributeType[], Guid[]]) => {
            const availabeAttributeTypes = value[0];
            const usedAttributeTypeIds = value[1];
            usedAttributeTypeIds.forEach((ua: Guid) => {
                if (availabeAttributeTypes.findIndex(a => a.TypeId === ua) < 0) {
                    this.deleteAttributeType(ua);
                }
            });
        });
    }

    initForm() {
        this.searchForm = new FormGroup({
          NameOrValue: new FormControl(),
          ItemType: new FormControl(),
          Attributes: new FormArray([]),
          ConnectionsToUpper: new FormArray([]),
          ConnectionsToLower: new FormArray([]),
          ResponsibleToken: new FormControl(),
        });
    }

    addItemType(itemType: ItemType) {
        this.searchForm.get('ItemType').enable();
        this.searchForm.get('ItemType').setValue(itemType.TypeId);
        this.store.dispatch(DisplayActions.searchAddItemType({itemTypeId: itemType.TypeId}));
        this.searchForm.markAsDirty();
    }

    deleteItemType() {
        this.searchForm.get('ItemType').setValue(undefined);
        this.searchForm.get('ItemType').disable();
        this.store.dispatch(DisplayActions.searchAddItemType({itemTypeId: undefined}));
        this.searchForm.markAsDirty();
    }

    itemTypeEnabled() {
        return this.searchForm.get('ItemType').enabled;
    }

    attributesPresent() {
        return (this.searchForm.get('Attributes') as FormArray).length !== 0;
    }

    attributeTypesAvailable() {
        return this.store.pipe(select(fromSelectDisplay.selectSearchAvailableSearchAttributeTypes),
            map((attributeTypes: AttributeType[]) => attributeTypes.length > 0),
        );
    }

    // private filterAttributes(attributes: FormGroup[]) {
    //     const posToDelete: number[] = [];
    //     for (const attribute of attributes) {
    //         const typeId = attribute.get('AttributeTypeId').value as Guid;
    //         if (!this.attributeTypePresent(typeId)) {
    //             posToDelete.push(attributes.indexOf(attribute));
    //             if (this.selectedAttributeTypes.includes(typeId)) {
    //                 this.selectedAttributeTypes.splice(this.selectedAttributeTypes.indexOf(typeId), 1);
    //             }
    //         }
    //     }
    //     posToDelete.reverse();
    //     for (const pos of posToDelete) {
    //         attributes.splice(pos, 1);
    //     }
    // }

    addAttributeType(attributeTypeId: Guid, attributeValue?: string) {
        this.store.dispatch(DisplayActions.searchAddAttributeType({attributeTypeId}));
        (this.searchForm.get('Attributes') as FormArray).push(new FormGroup({
          AttributeTypeId: new FormControl(attributeTypeId, Validators.required),
          AttributeValue: new FormControl(attributeValue ? attributeValue : undefined),
        }));
        this.searchForm.markAsDirty();
    }

    deleteAttributeType(attributeTypeId: Guid) {
        (this.searchForm.get('Attributes') as FormArray).controls.forEach((fg: FormGroup, index: number) => {
            if (fg.value.AttributeTypeId === attributeTypeId) {
                (this.searchForm.get('Attributes') as FormArray).removeAt(index);
            }
        });
        this.store.dispatch(DisplayActions.searchDeleteAttributeType({attributeTypeId}));
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
        return (this.searchForm.get('ConnectionsToUpper') as FormArray).controls as FormGroup[];
    }

    getConnectionsToLowerControls() {
        return (this.searchForm.get('ConnectionsToLower') as FormArray).controls as FormGroup[];
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
        this.searchForm.get('ResponsibleToken').setValue(undefined);
        this.searchForm.get('ResponsibleToken').disable();
        this.searchForm.markAsDirty();
    }

    responsibilityEnabled() {
        return this.searchForm.get('ResponsibleToken').enabled && !!this.searchForm.get('ResponsibleToken').value;
    }

    getProposals(text: string) {
        if (text === undefined || text.length < 2) {
            return new Observable<string[]>();
        }
        return this.http.get<string[]>(getUrl('Proposals/' + text));
    }
}
