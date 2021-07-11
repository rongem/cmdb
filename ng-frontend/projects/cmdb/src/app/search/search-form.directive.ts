import { Directive, Input } from '@angular/core';
import { FormGroupDirective, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { SearchContent, SearchAttribute, SearchConnection, MetaDataSelectors } from 'backend-access';

import { SearchFormSelectors, SearchFormActions } from '../shared/store/store.api';

@Directive({ selector: '[appSearchForm]' })
export class SearchFormDirective {
    @Input('appSearchForm')
    set data(val: SearchContent) {
        if (val) {
            this.formGroupDirective.form.patchValue(val);
            this.patchAttributeValues(val.attributes);
            this.patchConnections(val.connectionsToLower, this.formGroupDirective.form.get('connectionsToLower') as FormArray);
            this.patchConnections(val.connectionsToUpper, this.formGroupDirective.form.get('connectionsToUpper') as FormArray);
            this.formGroupDirective.form.markAsDirty();
        }
    }

    constructor(private formGroupDirective: FormGroupDirective,
                private actions$: Actions,
                private store: Store) {
        this.actions$.pipe(
            ofType(SearchFormActions.addItemType),
            switchMap(value =>
                this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(value.typeId)),
            ),
            withLatestFrom(this.store.select(SearchFormSelectors.searchUsedAttributeTypes)),
        ).subscribe(([availabeAttributeTypes, usedAttributeTypeIds]) => {
            usedAttributeTypeIds.forEach((ua: string) => {
                if (availabeAttributeTypes.findIndex(a => a.id === ua) < 0) {
                    this.store.dispatch(SearchFormActions.deleteAttributeType({typeId: ua}));
                }
            });
        });
    }

    private patchAttributeValues(attributes: SearchAttribute[]) {
        let attArray = (this.formGroupDirective.form.get('attributes') as FormArray);
        if (attributes) {
            const attMap = new Map<string, SearchAttribute>();
            const indexesToRemove: number[] = [];
            attributes.forEach(a => attMap.set(a.typeId, a));
            attArray.controls.forEach((c, index) => {
                if (attMap.has(c.value.typeId)) {
                    c.patchValue(attMap.get(c.value.typeId));
                    attMap.delete(c.value.typeId);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => attArray.removeAt(value));
            attMap.forEach(value => attArray.push(new FormGroup({
                typeId: new FormControl(value.typeId),
                value: new FormControl(value.value),
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
                const i = tmpConnections.findIndex(conn => conn.connectionTypeId === c.value.connectionTypeId &&
                    conn.configurationItemTypeId === c.value.configurationItemTypeId);
                if (i > -1) {
                    c.patchValue(tmpConnections[i]);
                    tmpConnections.splice(i, 1);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => connArray.removeAt(value));
            tmpConnections.forEach(value => {connArray.push(new FormGroup({
                connectionTypeId: new FormControl(value.connectionTypeId),
                configurationItemTypeId: new FormControl(value.configurationItemTypeId),
                count: new FormControl(value.count ? value.count : '1'),
            })); });
        } else {
            connArray = new FormArray([]);
        }

    }
}
