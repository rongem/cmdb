import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MetaDataActions } from 'backend-access';

import * as SearchFormActions from './search-form.actions';

@Injectable()
export class SearchFormEffects {
    metaDataChange$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap((value) => of(SearchFormActions.searchChangeMetaData({
                attributeTypes: value.metaData.attributeTypes,
        }))),
    ));

    constructor(private actions$: Actions) {}

}

