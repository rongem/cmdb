import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as AssetActions from './asset.actions';
// import * as fromAsset from './asset.selectors';

import { getConfigurationItemsByTypeName } from 'src/app/shared/store/functions';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ConverterService } from 'src/app/shared/store/converter.service';

@Injectable()
export class AssetEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    readRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRacks),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Rack).pipe(
                map(items => AssetActions.setRacks({racks: this.convert.convertToRacks(items)})),
                catchError(() => of(AssetActions.racksFailed)),
            )),
    ));
}
