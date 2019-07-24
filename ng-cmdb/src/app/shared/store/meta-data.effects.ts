import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { MetaData } from '../objects/meta-data.model';
import { getUrl, getHeader } from './functions';
import { AttributeGroup } from '../objects/attribute-group.model';
import { Result } from '../objects/result.model';

const METADATA = 'MetaData';
const ATTRIBUTEGROUP = 'AttributeGroup/';

@Injectable()
export class MetaDataEffects {
    @Effect()
    fetchMetaData = this.actions$.pipe(
        ofType(MetaDataActions.READ_STATE),
        switchMap(() => {
            return this.http.get<MetaData>(getUrl(METADATA)).pipe(
                map((result: MetaData) => new MetaDataActions.SetState(result)),
                catchError((error) => of(new MetaDataActions.Error(error)))
            );
        }),
    );

    @Effect()
    createAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ATTRIBUTEGROUP),
        switchMap((createdAttributeGroup: MetaDataActions.AddAttributeGroup) => {
            return this.http.post<Result>(getUrl(ATTRIBUTEGROUP),
                { attributeGroup: {
                    GroupId: createdAttributeGroup.payload.GroupId.toString(), GroupName: createdAttributeGroup.payload.GroupName } },
                { headers: getHeader() }).pipe(
                    map(() => new MetaDataActions.ReadState()),
                    catchError((error) => of(new MetaDataActions.Error(error))),
                );
        })
    );

    @Effect()
    updateAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ATTRIBUTEGROUP),
        switchMap((updatedAttributeGroup: MetaDataActions.UpdateAttributeGroup) => {
            return this.http.put<Result>(getUrl('AttributeGroup/' + updatedAttributeGroup.payload.GroupId),
                { attributeGroup: updatedAttributeGroup.payload },
                { headers: getHeader() }).pipe(
                    map(() =>  new MetaDataActions.ReadState()),
                    catchError((error) => of(new MetaDataActions.Error(error))),
            );
    }));

    @Effect()
    deleteAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ATTRIBUTEGROUP),
        switchMap((deletedAttributeGroup: MetaDataActions.DeleteAttributeGroup) => {
            return this.http.delete<Result>(getUrl('AttributeGroup/' + deletedAttributeGroup.payload.GroupId)).pipe(
                    map(() => new MetaDataActions.ReadState()),
                    catchError((error) => of(new MetaDataActions.Error(error)))
                );
        })
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

