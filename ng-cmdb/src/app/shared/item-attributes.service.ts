import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { ItemAttribute } from './item-attribute.model';

@Injectable()
export class ItemAttributesService {
    constructor(private http: HttpClient) {}

    getItemAttributes(): ItemAttribute[] {
        return [];
    }
}
