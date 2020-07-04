import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { itemForTypeIdAndName } from '../store/read-data/read.functions';
import { ValidatorModule } from './validator.module';
import { selectItemTypes } from '../store/meta-data/meta-data.selectors';
import { ItemType } from '../objects/meta-data/item-type.model';

@Injectable({providedIn: ValidatorModule})
export class ValidatorService {
    private textObjectPresentMap = new Map<string, Observable<boolean>>();
    private itemTypes: ItemType[] = [];
    private typeId = '';
    private timeout: ReturnType<typeof setTimeout>;

    constructor(private http: HttpClient, private store: Store) {
        this.store.select(selectItemTypes).subscribe(itemTypes => this.itemTypes = itemTypes);
    }

    // cache queries for items of that type and name
    private getExistingObjects(name: string, typeId: string) {
        if (!this.textObjectPresentMap.has(name + '/' + typeId)) {
            this.textObjectPresentMap.set(name + '/' + typeId,
                itemForTypeIdAndName(this.http, typeId, name).pipe(map(ci => !!ci && !!ci.id))
            );
        }
        return this.textObjectPresentMap.get(name + '/' + typeId);
    }

    setTypeByName(name: string) {
        this.clearCache();
        this.typeId = this.itemTypes.find(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase())?.id;
    }

    clearCache = () => this.textObjectPresentMap.clear();

    validateNameAndType: AsyncValidatorFn = (c: FormGroup): Observable<ValidationErrors> => {
        if (this.timeout) { clearTimeout(this.timeout); }
        this.timeout = setTimeout(this.clearCache, 60000);
        return this.getExistingObjects(c.value.name, c.value.typeId ? c.value.typeId : this.typeId).pipe(
            map(value => value === true ? {'item with this name and type already exists': true} : null),
        );
    }

}
