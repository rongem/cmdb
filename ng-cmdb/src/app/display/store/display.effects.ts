import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
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
    @Effect()
    readConfigurationItem = this.actions$.pipe(
        ofType(DisplayActions.READ_CONFIGURATION_ITEM),
        switchMap((action: DisplayActions.ReadConfigurationItem) => {
            return this.http.get<FullConfigurationItem>(getUrl('ConfigurationItem/' + action.payload.toString() + '/Full'),
                { headers: getHeader() }).pipe(
                    map(item => new DisplayActions.SetConfigurationItem(item)),
                    catchError((error: HttpErrorResponse) => {
                        return of(new DisplayActions.ClearConfigurationItem(new Result(false, error.message)));
                    })
            );
        })
    );

    @Effect()
    metaDataChange = this.actions$.pipe(
        ofType(MetaDataActions.SET_STATE),
        switchMap((action: MetaDataActions.SetState) => of(new DisplayActions.SearchChangeMetaData({
                attributeTypes: action.payload.attributeTypes,
        }))),
    );

    @Effect()
    itemTypeChange = this.actions$.pipe(
        ofType(MetaDataActions.SET_CURRENT_ITEMTYPE),
        switchMap((action: MetaDataActions.SetCurrentItemType) => {
            console.log(action);
            return of(action);
        }),
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

