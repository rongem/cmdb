import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as MetaDataActions from './meta-data.actions';

import { MetaData } from '../objects/source/meta-data.model';
import { getUrl, post } from './functions';
import { AppConfigService } from '../app-config.service';
import { AttributeGroup } from '../objects/source/attribute-group.model';
import { Guid } from '../guid';

const METADATA = 'MetaData';

@Injectable()
export class MetaDataEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    fetchMetaData$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.readState),
        switchMap(() => {
            return this.http.get<MetaData>(getUrl(METADATA)).pipe(
                map((metaData: MetaData) => MetaDataActions.setState({metaData})),
                catchError((error) => of(MetaDataActions.error({error, invalidateData: true})))
            );
        }),
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createAttributeGroup),
        concatMap((action) => post(this.http, 'AttributeGroup', { attributeGroup: action.attributeGroup }))
    ), {dispatch: false});

    // check if all necessary meta data exists and create it if not
    setState$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap(action => {
            let changesOccured = false;
            Object.keys(AppConfigService.objectModel.AttributeGroupNames).forEach(key => {
                const agn = AppConfigService.objectModel.AttributeGroupNames[key] as string;
                let attributeGroup = action.metaData.attributeGroups.find(ag =>
                    ag.GroupName.toLocaleLowerCase() === agn.toLocaleLowerCase());
                if (!attributeGroup) {
                    attributeGroup = { GroupId: Guid.create(), GroupName: AppConfigService.objectModel.AttributeGroupNames[key]};
                    this.store.dispatch(MetaDataActions.createAttributeGroup({attributeGroup}));
                    changesOccured = true;
                }
            });
            Object.keys(AppConfigService.objectModel.AttributeTypeNames).forEach(key => {});
            Object.keys(AppConfigService.objectModel.ConfigurationItemTypeNames).forEach(key => {});
            Object.keys(AppConfigService.objectModel.ConnectionTypeNames).forEach(key => {});
            console.log(changesOccured, typeof changesOccured);
            if (changesOccured) {
                this.store.dispatch(MetaDataActions.readState);
            }
            return of(null);
        })
    ), {dispatch: false});
}

