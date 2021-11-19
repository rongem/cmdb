import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { SearchContent, SearchActions, MetaDataSelectors } from 'backend-access';

import { SearchFormActions, SearchFormSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  form: FormGroup;

  constructor(private store: Store,
              private fb: FormBuilder) { }

  get forms$() {
    return this.store.select(SearchFormSelectors.getForm);
  }

  get noSearchResult() {
    return this.store.select(SearchFormSelectors.noSearchResult);
  }

  get searching() {
    return this.store.select(SearchFormSelectors.searching);
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get itemType() {
    return this.store.select(SearchFormSelectors.searchItemType);
  }

  get itemTypeBackColor() {
    return this.store.select(SearchFormSelectors.searchItemType).pipe(
      map(itemType => itemType ? itemType.backColor : 'inherit'),
    );
  }

  get selectedAttributeTypes() {
    return this.store.select(SearchFormSelectors.searchUsedAttributeTypes);
  }

  get allowedAttributeTypeList() {
    return this.store.select(SearchFormSelectors.availableSearchAttributeTypes);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.select(SearchFormSelectors.connectionTypesForCurrentIsLowerSearchItemType);
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.select(SearchFormSelectors.connectionTypesForCurrentIsUpperSearchItemType);
  }

  ngOnInit() {
    this.form = this.fb.group({
      nameOrValue: '',
      itemTypeId: undefined,
      attributes: this.fb.array([]),
      connectionsToUpper: this.fb.array([]),
      connectionsToLower: this.fb.array([]),
      responsibleToken: '', },
      { validators: this.validateForm }
    );
  }

  onChangeText(text: string) {
    this.store.dispatch(SearchFormActions.addNameOrValue({text}));
  }

  onAddAttributeType(typeId: string) {
    this.store.dispatch(SearchFormActions.addAttributeType({typeId}));
  }

  onChangeAttributeValue(value: {typeId: string; value: string}) {
    this.store.dispatch(SearchFormActions.changeAttributeValue(value));
  }

  onDeleteAttribute(typeId: string) {
    this.store.dispatch(SearchFormActions.deleteAttributeType({typeId}));
  }

  onAddConnectionToUpper(value: {connectionTypeId: string; itemTypeId?: string}) {
    this.store.dispatch(SearchFormActions.addConnectionTypeToUpper(value));
  }

  onChangeConnectionToUpperCount(value: {index: number; count: string}) {
    this.store.dispatch(SearchFormActions.changeConnectionCountToUpper(value));
  }

  onDeleteConnectionToUpper(index: number) {
    this.store.dispatch(SearchFormActions.deleteConnectionTypeToUpper({index}));
  }

  onAddConnectionToLower(value: {connectionTypeId: string; itemTypeId?: string}) {
    this.store.dispatch(SearchFormActions.addConnectionTypeToLower(value));
  }

  onChangeConnectionToLowerCount(value: {index: number; count: string}) {
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
    // console.log(this.form.value);
    const itemTypeId = this.form.get('itemTypeId');
    if (itemTypeId?.value === '') {
      itemTypeId.setValue(undefined);
      itemTypeId.disable();
    }
    this.store.dispatch(SearchActions.performSearchFull({searchContent: this.form.value as SearchContent}));
  }

  validateForm: ValidatorFn = (fg: AbstractControl) => {
    if (fg.value.nameOrValue === '' && !fg.value.itemTypeId && fg.value.attributes.length === 0) {
      return {noValueSetError: true};
    }
    return null;
  };
}
