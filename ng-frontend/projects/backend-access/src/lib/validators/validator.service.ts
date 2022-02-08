import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { itemForTypeIdAndName } from '../store/read-data/read.functions';
import { ValidatorModule } from './validator.module';
import { selectItemTypes } from '../store/meta-data/meta-data.selectors';
import { ItemType } from '../objects/meta-data/item-type.model';
import { AppConfigService } from '../app-config/app-config.service';

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

    // validate if a control's value exists as a name with a given type
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

    // validate if a control's value is a valid regular expression pattern, containing ^ for start and $ for end
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

    // validate if a control's value is a valid url
    validatUrl: ValidatorFn = (control: AbstractControl) => {
        if (typeof control.value === 'string' && AppConfigService.validURL(control.value)) {
          return null;
        }
        return {notAValidUrl: true};
    };

    // validate, if a control's value is trimmed
    validateTrimmed: ValidatorFn = (control: AbstractControl) => {
        if (typeof control.value === 'string' && control.value !== control.value.trim()) {
          return {noTrailingOrLeadingSpacesAllowedError: true};
        }
        return null;
    };

    // validate if a control's value matches a given regular expression
    validateMatchesRegex = (regex: string): ValidatorFn => (control: AbstractControl) => {
        const r = new RegExp(regex);
        if (typeof control.value === 'string' && !r.test(control.value)) {
            return {notMatchingRegexp: true};
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
