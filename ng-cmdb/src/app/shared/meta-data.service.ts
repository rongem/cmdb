import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { ItemAttribute } from './item-attribute.model';
import { map } from 'rxjs/operators';

@Injectable()
export class MetaDataService {
    constructor(private http: HttpClient) {}

    getAttributeTypes() {
        return this.http.get('http://localhost:51717/API/REST.svc/GetAttributeTypes');
    }

    getItemTypes() {
        return this.http.get('http://localhost:51717/API/REST.svc/GetItemTypes')
            .pipe(map((result) => { console.log(result); }));
    }
}
