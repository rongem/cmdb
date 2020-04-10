import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Guid, SearchContent, SearchActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as SearchFormActions from 'projects/cmdb/src/app/display/store/search-form.actions';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';
import * as fromSelectSearchForm from 'projects/cmdb/src/app/display/store/search-form.selectors';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  forms$ = this.store.select(state => state.display.search.form);
  form: FormGroup;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder) { }

  ngOnInit() {
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
    this.store.dispatch(SearchFormActions.addNameOrValue({text}));
  }

  onAddAttributeType(attributeTypeId: Guid) {
    this.store.dispatch(SearchFormActions.addAttributeType({attributeTypeId}));
  }

  onChangeAttributeValue(value: {attributeTypeId: Guid, attributeValue: string}) {
    this.store.dispatch(SearchFormActions.changeAttributeValue(value));
  }

  onDeleteAttribute(attributeTypeId: Guid) {
    this.store.dispatch(SearchFormActions.deleteAttributeType({attributeTypeId}));
  }

  onAddConnectionToUpper(value: {connectionTypeId: Guid, itemTypeId?: Guid}) {
    this.store.dispatch(SearchFormActions.addConnectionTypeToUpper(value));
  }

  onChangeConnectionToUpperCount(value: {index: number, count: string}) {
    this.store.dispatch(SearchFormActions.changeConnectionCountToUpper(value));
  }

  onDeleteConnectionToUpper(index: number) {
    this.store.dispatch(SearchFormActions.deleteConnectionTypeToUpper({index}));
  }

  onAddConnectionToLower(value: {connectionTypeId: Guid, itemTypeId?: Guid}) {
    this.store.dispatch(SearchFormActions.addConnectionTypeToLower(value));
  }

  onChangeConnectionToLowerCount(value: {index: number, count: string}) {
    this.store.dispatch(SearchFormActions.changeConnectionCountToLower(value));
  }

  onDeleteConnectionToLower(index: number) {
    this.store.dispatch(SearchFormActions.deleteConnectionTypeToLower({index}));
  }

  onChangeResponsibility(token: string) {
    this.store.dispatch(SearchFormActions.setResponsibility({token}));
  }

  onResetForm() {
    this.store.dispatch(SearchFormActions.resetForm());
  }

  onSubmit() {
    console.log(this.form.value);

    this.store.dispatch(SearchActions.performSearch({searchContent: this.form.value as SearchContent}));
  }

  get noSearchResult() {
    return this.store.select(fromSelectDisplay.getSearchState).pipe(map(state => state.noSearchResult));
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get itemType() {
    return this.store.select(fromSelectSearchForm.selectSearchItemType);
  }

  get itemTypeBackColor() {
    return this.store.pipe(
      select(fromSelectSearchForm.selectSearchItemType),
      map(itemType => itemType ? itemType.TypeBackColor : 'inherit'),
    );
  }

  get selectedAttributeTypes() {
    return this.store.select(fromSelectSearchForm.selectSearchUsedAttributeTypes);
  }

  get allowedAttributeTypeList() {
    return this.store.select(fromSelectSearchForm.selectSearchAvailableSearchAttributeTypes);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.select(fromSelectSearchForm.selectConnectionTypesForCurrentIsLowerSearchItemType);
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.select(fromSelectSearchForm.selectConnectionTypesForCurrentIsUpperSearchItemType);
  }

  validateForm(fg: FormGroup) {
    if (fg.value.NameOrValue === '' && !fg.value.ItemType && fg.value.Attributes.length === 0) {
      return 'at least one value must be set';
    }
    return null;
  }
}
