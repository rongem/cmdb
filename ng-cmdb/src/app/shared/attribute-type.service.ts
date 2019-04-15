import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { ItemAttribute } from './item-attribute.model';

@Injectable()
export class AttributeTypeService {
    constructor(private http: HttpClient) {}

    getAttributeTypes() {
        return this.http.get('http://localhost:51717/API/REST.svc/GetAttributeTypes');
    }
}
