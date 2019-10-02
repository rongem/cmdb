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
import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectSearch from 'src/app/display/store/search.selectors';

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
            ofType(SearchActions.addItemType),
            switchMap(value =>
                this.store.pipe(select(fromSelectMetaData.selectAttributeTypesForItemType,
                    value.itemTypeId)),
            ),
            withLatestFrom(this.store.pipe(select(fromSelectSearch.selectSearchUsedAttributeTypes))),
        ).subscribe((value: [AttributeType[], Guid[]]) => {
            const availabeAttributeTypes = value[0];
            const usedAttributeTypeIds = value[1];
            console.log(usedAttributeTypeIds);
            console.log(availabeAttributeTypes);
            usedAttributeTypeIds.forEach((ua: Guid) => {
                if (availabeAttributeTypes.findIndex(a => a.TypeId === ua) < 0) {
                    this.store.dispatch(SearchActions.deleteAttributeType({attributeTypeId: ua}));
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

    addNameOrValue(text: string) {
        this.store.dispatch(SearchActions.addNameOrValue({text}));
    }

    addItemType(itemType: ItemType) {
        // this.searchForm.get('ItemType').enable();
        // this.searchForm.get('ItemType').setValue(itemType.TypeId);
        this.store.dispatch(SearchActions.addItemType({itemTypeId: itemType.TypeId}));
        // this.searchForm.markAsDirty();
    }

    deleteItemType() {
        // this.searchForm.get('ItemType').setValue(undefined);
        // this.searchForm.get('ItemType').disable();
        this.store.dispatch(SearchActions.addItemType({itemTypeId: undefined}));
        // this.searchForm.markAsDirty();
    }

    get attributesPresent() {
        return (this.searchForm.get('Attributes') as FormArray).length !== 0;
    }

    get attributeControls() {
        return (this.searchForm.get('Attributes') as FormArray).controls;
    }

    get connectionsToUpperPresent() {
        return (this.searchForm.get('ConnectionsToUpper') as FormArray).length !== 0;
    }

    get connectionsToLowerPresent() {
        return (this.searchForm.get('ConnectionsToLower') as FormArray).length !== 0;
    }

    get connectionsToUpperControls() {
        return (this.searchForm.get('ConnectionsToUpper') as FormArray).controls as FormGroup[];
    }

    get connectionsToLowerControls() {
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

    get responsibilityEnabled() {
        return this.searchForm.get('ResponsibleToken').enabled && !!this.searchForm.get('ResponsibleToken').value;
    }

    getProposals(text: string) {
        if (text === undefined || text.length < 2) {
            return new Observable<string[]>();
        }
        return this.http.get<string[]>(getUrl('Proposals/' + text));
    }
}
