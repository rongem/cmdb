import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { SearchContent } from './search-content.model';

@Directive({ selector: '[appSearchForm]' })
export class SearchFormDirective {
    @Input('appSearchForm')
    set data(val: SearchContent) {
        // console.log(val);
        if (val) {
            if (val.Attributes) {
                console.log(val.Attributes);
                this.formGroupDirective.form.get('Attributes').setValue([...val.Attributes]);
                console.log(this.formGroupDirective.form.get('Attributes').value);
            }
            this.formGroupDirective.form.patchValue(val);
            // console.log(this.formGroupDirective.form.value);
            this.formGroupDirective.form.markAsDirty();
        }
    }

    constructor(private formGroupDirective: FormGroupDirective) {}
}
