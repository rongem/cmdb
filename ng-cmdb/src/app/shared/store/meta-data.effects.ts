import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import * as fromApp from '../store/app.reducer';
import * as fromMetaData from './meta-data.reducer';
import { DataAccessService } from '../data-access.service';
import { MetaData } from '../objects/meta-data.model';

const getUrl = (service: string) => 'http://localhost:51717/API/REST.svc/' + service;
const getHeader = () => new HttpHeaders({ 'Content-Type': 'application/json'});

@Injectable()
export class MetaDataEffects {
    @Effect()
    fetchMetaData = this.actions$.pipe(
        ofType(MetaDataActions.READ_STATE),
        switchMap(() => {
            console.log('here');
            return this.http.get<MetaData>(getUrl('MetaData')).pipe(
                map((result: MetaData) => {
                    console.log(result);
                    return new MetaDataActions.SetState(result);
                }),
                catchError((error) => {
                    return of(new MetaDataActions.Error(error));
                })
            );
            // return forkJoin({
            //     userName: this.data.fetchUserName(),
            //     userRole: this.data.fetchUserRole(),
            //     attributeGroups: this.data.fetchAttributeGroups(),
            //     attributeTypes: this.data.fetchAttributeTypes(),
            //     connectionRules: this.data.fetchConnectionRules(),
            //     connectionTypes: this.data.fetchConnectionTypes(),
            //     itemTypes: this.data.fetchItemTypes(),
            // });
        }),
    );

    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient,
                private data: DataAccessService) {}
}
