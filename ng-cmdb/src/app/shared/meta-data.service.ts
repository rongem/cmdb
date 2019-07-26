import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from './store/app.reducer';
import * as MetaDataActions from './store/meta-data.actions';
import { AttributeType } from './objects/attribute-type.model';

@Injectable({providedIn: 'root'})
export class MetaDataService {
    constructor(private store: Store<fromApp.AppState>) {}
}
