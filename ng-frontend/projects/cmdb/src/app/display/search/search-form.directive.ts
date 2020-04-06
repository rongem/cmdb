import { Directive, Input } from '@angular/core';
import { FormGroupDirective, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { withLatestFrom, switchMap } from 'rxjs/operators';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as SearchActions from 'projects/cmdb/src/app/display/store/search.actions';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectSearch from 'projects/cmdb/src/app/display/store/search.selectors';

import { Guid } from 'projects/cmdb/src/app/shared/guid';
import { SearchContent } from './objects/search-content.model';
import { SearchAttribute } from './objects/search-attribute.model';
import { SearchConnection } from './objects/search-connection.model';
import { AttributeType } from 'projects/cmdb/src/app/shared/objects/attribute-type.model';

@Directive({ selector: '[appSearchForm]' })
export class SearchFormDirective {
    @Input('appSearchForm')
    set data(val: SearchContent) {
        if (val) {
            this.formGroupDirective.form.patchValue(val);
            this.patchAttributeValues(val.Attributes);
            this.patchConnections(val.ConnectionsToLower, this.formGroupDirective.form.get('ConnectionsToLower') as FormArray);
            this.patchConnections(val.ConnectionsToUpper, this.formGroupDirective.form.get('ConnectionsToUpper') as FormArray);
            this.formGroupDirective.form.markAsDirty();
        }
    }

    constructor(private formGroupDirective: FormGroupDirective,
                private actions$: Actions,
                private store: Store<fromApp.AppState>) {
        this.actions$.pipe(
            ofType(SearchActions.addItemType),
            switchMap(value =>
                this.store.select(fromSelectMetaData.selectAttributeTypesForItemType,
                    value.itemTypeId),
            ),
            withLatestFrom(this.store.select(fromSelectSearch.selectSearchUsedAttributeTypes)),
        ).subscribe((value: [AttributeType[], Guid[]]) => {
            const availabeAttributeTypes = value[0];
            const usedAttributeTypeIds = value[1];
            usedAttributeTypeIds.forEach((ua: Guid) => {
                if (availabeAttributeTypes.findIndex(a => a.TypeId === ua) < 0) {
                    this.store.dispatch(SearchActions.deleteAttributeType({attributeTypeId: ua}));
                }
            });
        });
    }

    private patchAttributeValues(attributes: SearchAttribute[]) {
        let attArray = (this.formGroupDirective.form.get('Attributes') as FormArray);
        if (attributes) {
            const attMap = new Map<Guid, SearchAttribute>();
            const indexesToRemove: number[] = [];
            attributes.forEach(a => attMap.set(a.AttributeTypeId, a));
            attArray.controls.forEach((c, index) => {
                if (attMap.has(c.value.attributeTypeId)) {
                    c.patchValue(attMap.get(c.value.attributeTypeId));
                    attMap.delete(c.value.attributeTypeId);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => attArray.removeAt(value));
            attMap.forEach(value => attArray.push(new FormGroup({
                AttributeTypeId: new FormControl(value.AttributeTypeId),
                AttributeValue: new FormControl(value.AttributeValue),
            })));
        } else {
            attArray = new FormArray([]);
        }
    }

    private patchConnections(connections: SearchConnection[], connArray: FormArray) {
        if (connections.length === 0 && connArray.length === 0) { return; }
        const tmpConnections = [...connections];
        if (connections) {
            const indexesToRemove: number[] = [];
            connArray.controls.forEach((c, index) => {
                const i = tmpConnections.findIndex(conn => conn.ConnectionType === c.value.ConnectionType &&
                    conn.ConfigurationItemType === c.value.ConfigurationItemType);
                if (i > -1) {
                    c.patchValue(tmpConnections[i]);
                    tmpConnections.splice(i, 1);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => connArray.removeAt(value));
            tmpConnections.forEach(value => {connArray.push(new FormGroup({
                ConnectionType: new FormControl(value.ConnectionType),
                ConfigurationItemType: new FormControl(value.ConfigurationItemType),
                Count: new FormControl(value.Count ? value.Count : '1'),
            })); });
        } else {
            connArray = new FormArray([]);
        }

    }
}
