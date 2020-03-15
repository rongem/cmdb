import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, catchError, mergeMap, concatMap, withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DataActions from './data.actions';
import * as MetaDataActions from './meta-data.actions';
import * as fromSelectMetaData from './meta-data.selectors';

import { MetaData } from '../objects/rest-api/meta-data.model';
import { getUrl, post, put, del } from './functions';
import { AppConfigService } from '../app-config.service';
import { Guid } from '../guid';
import { UserRole } from '../objects/rest-api/user-role.enum';
import { Mappings } from '../objects/appsettings/mappings.model';
import { RuleSettings, RuleTemplate } from '../objects/appsettings/rule-settings.model';
import { ConnectionTypeTemplate } from '../objects/appsettings/app-object.model';
import { ConnectionType } from '../objects/rest-api/connection-type.model';
import { Result } from '../objects/rest-api/result.model';

const CONFIGURATIONITEM = 'ConfigurationItem';
const FULL = '/Full';
const ATTRIBUTE = 'ItemAttribute';
const CONNECTION = 'Connection';

@Injectable()
export class DataEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    createItem$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.createItem),
        concatMap(action => {
            return post(this.http, CONFIGURATIONITEM + FULL,
                { configurationItem: action.item }, MetaDataActions.noAction, false
            );
        })
    ));

    updateItem$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.updateItem),
    ));

    deleteItem$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.deleteItem),
    ));

    createAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.createAttribute),
        concatMap(action => {
            return post(this.http, ATTRIBUTE, {
                attribute: action.attribute,
            }, MetaDataActions.noAction(), false);
        }),
    ));

    updateAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.updateAttribute),
        concatMap(action => {
            return put(this.http, ATTRIBUTE + '/' + action.attribute.AttributeId, {
                attribute: action.attribute,
            }, MetaDataActions.noAction(), false);
        }),
    ));

    deleteAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.deleteAttribute),
        concatMap(action => {
            return del(this.http, ATTRIBUTE + '/' + action.attribute.AttributeId, MetaDataActions.noAction());
        })
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.createConnection),
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.updateConnection),
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(DataActions.deleteConnection),
    ));

}
