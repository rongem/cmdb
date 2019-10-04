import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectSearch from 'src/app/display/store/search.selectors';

import { SearchContent } from '../search-content.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  metaData: Observable<fromMetaData.State>;
  displayState: Observable<fromDisplay.State>;
  forms$ = this.store.select(state => state.display.search.form);
  form: FormGroup;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
    this.form = this.fb.group({
      NameOrValue: '',
      ItemType: undefined,
      Attributes: this.fb.array([]),
      ConnectionsToUpper: this.fb.array([]),
      ConnectionsToLower: this.fb.array([]),
      ResponsibleToken: '', },
      { validators: this.validateForm.bind(this) }
    );
  }

  onChangeText(text: string) {
    this.store.dispatch(SearchActions.addNameOrValue({text}));
  }

  onChangeResponsibility(token: string) {
    this.store.dispatch(SearchActions.setResponsibility({token}));
  }

  onResetForm() {
    this.store.dispatch(SearchActions.resetForm());
  }

  onSubmit() {
    console.log(this.form.value);

    this.store.dispatch(SearchActions.performSearch({searchContent: this.form.value as SearchContent}));
  }

  get itemTypeBackColor() {
    return this.store.pipe(
      select(fromSelectSearch.selectSearchItemType),
      map(itemType => itemType ? itemType.TypeBackColor : 'inherit'),
    );
  }

  validateForm(fg: FormGroup) {
    if (fg.value.NameOrValue === '' && !fg.value.ItemType && fg.value.Attributes.length === 0) {
      return 'at least one value must be set';
    }
    return null;
  }
}
