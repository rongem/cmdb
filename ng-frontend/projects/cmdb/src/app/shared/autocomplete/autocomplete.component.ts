import { Component, ContentChild, ContentChildren, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { switchMap, merge } from 'rxjs';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'appAutocomplete',
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('root') rootTemplate: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content: AutocompleteContentDirective;

  @ContentChildren(OptionComponent) options: QueryList<OptionComponent>;

  constructor() { }

  ngOnInit(): void {
  }

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map((option: OptionComponent) => option.click$);
        return merge(...clicks$);
      })
    );
  }

}
