import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as DisplayActions from './display.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Result } from 'src/app/shared/objects/result.model';

@Injectable()
export class DisplayEffects {
    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(DisplayActions.readConfigurationItem),
        switchMap(action =>
            this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + action.itemId.toString() + '/Full'),
                { headers: getHeader() }).pipe(
                    map(item => DisplayActions.setConfigurationItem({configurationItem: item})),
                    catchError((error: HttpErrorResponse) => {
                        return of(DisplayActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    })
            )
        )
    ));

    metaDataChange$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.SET_STATE),
        switchMap((action: MetaDataActions.SetState) => of(DisplayActions.searchChangeMetaData({
                attributeTypes: action.payload.attributeTypes,
        }))),
    ));

    itemTypeChange$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.SET_CURRENT_ITEMTYPE),
        switchMap((action: MetaDataActions.SetCurrentItemType) => action.payload ?
            of(DisplayActions.searchAddItemType({itemTypeId: action.payload.TypeId})) : of(DisplayActions.searchDeleteItemType())),
    ));

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

