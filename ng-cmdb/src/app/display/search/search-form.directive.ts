import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({selector: '[appSearchForm]'})
export class SearchFormDirective {
    @Input('searchForm')
    set data(val: any) {
        if (val) {
            this.formGroupDirective.form.patchValue(val);
            this.formGroupDirective.form.markAsDirty();
        }
    }

    constructor(private formGroupDirective: FormGroupDirective) {}
}
