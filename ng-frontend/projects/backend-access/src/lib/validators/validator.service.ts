import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

    setTypeByName(name: string) {
        this.clearCache();
        this.typeId = this.itemTypes.find(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase())?.id;
    }

    clearCache = () => this.textObjectPresentMap.clear();

    validateNameAndType: AsyncValidatorFn = (c: AbstractControl) => {
        if (this.timeout) { clearTimeout(this.timeout); }
        this.timeout = setTimeout(this.clearCache, 60000);
        if (!c.value.name || c.value.name.length === 0) {
            return of({itemNameEmpty: true});
        }
        return this.getExistingObjects(c.value.name, c.value.typeId ?? this.typeId).pipe(
            map(value => value === true ? {nameAndTypeAlreadyExist: 'item with this name and type already exists'} : null),
        );
    };

    validateRegex: ValidatorFn = (c: AbstractControl) => {
        const content = (c.value as string)?.trim() ?? '';
        if (!content || !content.startsWith('^') || !content.endsWith('$')) {
          return {noFullLineRegexpError: true};
        }
        try {
          const regex = RegExp(c.value);
        } catch (e) {
          return e;
        }
        return null;
    };

    // cache queries for items of that type and name
    private getExistingObjects(name: string, typeId: string) {
        if (!this.textObjectPresentMap.has(name + '/' + typeId)) {
            this.textObjectPresentMap.set(name + '/' + typeId,
                itemForTypeIdAndName(this.http, typeId, name).pipe(
                    map(ci => !!ci && !!ci.id),
                    catchError((error: HttpErrorResponse) => of(error.status !== 404))
                )
            );
        }
        return this.textObjectPresentMap.get(name + '/' + typeId);
    }

}
