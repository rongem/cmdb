import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAutocompleteContent]',
    standalone: false
})
export class AutocompleteContentDirective {

  constructor(public tpl: TemplateRef<any>) { }

}
