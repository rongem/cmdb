import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import * as ReadActions from './read.actions';

import { getUrl, getHeader } from '../../functions';
import { RestFullConfigurationItem } from '../../rest-api/item-data/full/full-configuration-item.model';
import { Result } from '../../objects/item-data/result.model';
import { CONFIGURATIONITEM, FULL } from '../constants';

@Injectable()
export class DisplayEffects {
    constructor(private actions$: Actions,
                private http: HttpClient) {}

    readConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(ReadActions.readConfigurationItem),
        mergeMap(action =>
            this.http.get<RestFullConfigurationItem>(
                getUrl(CONFIGURATIONITEM + action.itemId + FULL),
                { headers: getHeader() }).pipe(
                    map(item => ReadActions.setConfigurationItem({configurationItem: {
                        id: item.id.toString(),
                        name: item.name,
                        color: item.color,
                        lastChange: item.lastChange,
                        type: item.type,
                        typeId: item.typeId.toString(),
                        userIsResponsible: item.userIsResponsible,
                        version: item.version,
                        attributes: item.attributes?.map(a => ({
                            id: a.id.toString(),
                            typeId: a.typeId.toString(),
                            type: a.type,
                            value: a.value,
                            lastChange: a.lastChange,
                            version: a.version,
                        })),
                        connectionsToLower: item.connectionsToLower?.map(c => ({
                            id: c.id.toString(),
                            typeId: c.typeId.toString(),
                            type: c.connectionType,
                            ruleId: c.ruleId.toString(),
                            description: c.description,
                            targetId: c.targetId.toString(),
                            targetType: c.targetType,
                            targetTypeId: c.targetTypeId.toString(),
                            targetName: c.targetName,
                            targetColor: c.targetColor,
                        })),
                        connectionsToUpper: item.connectionsToUpper?.map(c => ({
                            id: c.id.toString(),
                            typeId: c.typeId.toString(),
                            type: c.connectionType,
                            ruleId: c.ruleId.toString(),
                            description: c.description,
                            targetId: c.targetId.toString(),
                            targetType: c.targetType,
                            targetTypeId: c.targetTypeId.toString(),
                            targetName: c.targetName,
                            targetColor: c.targetColor,
                        })),
                        links: item.links?.map(l => ({
                            id: l.id.toString(),
                            uri: l.uri,
                            description: l.description,
                        })),
                        responsibilities: item.responsibilities?.map(r => ({
                            account: r.account,
                            invalidAccount: r.invalidAccount,
                            mail: r.mail,
                            name: r.name,
                            office: r.office,
                            phone: r.phone,
                        })),
                    }})),
                    catchError((error: HttpErrorResponse) => {
                        return of(ReadActions.clearConfigurationItem({result: new Result(false, error.message)}));
                    }),
            )
        )
    ));
}
