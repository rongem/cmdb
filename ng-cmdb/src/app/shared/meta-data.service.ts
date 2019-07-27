import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as fromApp from './store/app.reducer';
import * as fromMetaData from './store/meta-data.reducer';
import * as MetaDataActions from './store/meta-data.actions';
import { getUrl } from './store/functions';
import { AttributeType } from './objects/attribute-type.model';
import { ItemAttribute } from './objects/item-attribute.model';

const ATTRIBUTETYPE = 'AttributeType/';
const ATTRIBUTES = '/Attributes';

@Injectable({providedIn: 'root'})
export class MetaDataService {
    constructor(private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    getAttributesForAttributeType(attributeType: AttributeType) {
        return this.http.get<ItemAttribute[]>(getUrl(ATTRIBUTETYPE + attributeType.TypeId + ATTRIBUTES));
    }
}
