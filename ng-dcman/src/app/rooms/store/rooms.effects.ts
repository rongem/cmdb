import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as RoomsActions from 'src/app/rooms/store/rooms.actions';

import { getUrl, getConfigurationItem, getConfigurationItemsByType } from 'src/app/shared/store/functions';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { Guid } from 'src/app/shared/guid';
import { ConverterService } from 'src/app/shared/store/converter.service';

@Injectable()
export class RoomsEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private convert: ConverterService) {}

    readRooms$ = createEffect(() => this.actions$.pipe(
        ofType(RoomsActions.readRooms),
        switchMap((action) => {
            return getConfigurationItemsByType(this.http, Guid.parse(AppConfigService.objectModel.ConfigurationItemTypeNames.Room)).pipe(
                map((roomItems: FullConfigurationItem[]) => RoomsActions.setRooms({rooms: this.convert.convertToRooms(roomItems)}))
            );
        })
    ));
}
