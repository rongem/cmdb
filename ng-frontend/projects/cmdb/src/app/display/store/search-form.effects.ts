import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as SearchFormActions from './search-form.actions';
import * as MetaDataActions from 'backend-access';

@Injectable()
export class SearchFormEffects {
    constructor(private actions$: Actions) {}

    metaDataChange$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap((value) => of(SearchFormActions.searchChangeMetaData({
                attributeTypes: value.metaData.attributeTypes,
        }))),
    ));
}

