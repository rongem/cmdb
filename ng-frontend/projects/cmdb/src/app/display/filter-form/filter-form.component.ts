import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, SearchContent, SearchActions } from 'backend-access';
import { map, switchMap, tap, withLatestFrom } from 'rxjs';

import { SearchFormActions, SearchFormSelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {
  options = [];
  control: {value: string};
  newFilterType = '';
  newNameOrValue = '';
  newAttributeType = '';
  newAttributeValue = '';
  form: FormGroup;

  constructor(private store: Store, private actions$: Actions, private fb: FormBuilder) {
    this.newFilterType = this.defaultFilterType;
  }

  get form$() {
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

  get searchItemType() {
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

  private get defaultFilterType() {
    return 'nameOrValue';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameOrValue: '',
      itemTypeId: undefined,
      attributes: this.fb.array([]),
      connectionsToUpper: this.fb.array([]),
      connectionsToLower: this.fb.array([]),
      responsibleToken: '', },
      { validators: this.validateForm }
    );
    this.actions$.pipe(
      ofType(SearchFormActions.addNameOrValue, SearchFormActions.changeAttributeValue),
      tap(action => console.log(action)),
      switchMap(()=> this.store.select(SearchFormSelectors.getForm)),
      map((searchContent) => SearchActions.performSearchFull({searchContent})),
    );
  }

  validateForm: ValidatorFn = (fg: AbstractControl) => {
    if (fg.value.nameOrValue === '' && !fg.value.itemTypeId && fg.value.attributes.length === 0) {
      return {noValueSetError: true};
    }
    return null;
  };

  onChangeText() {
    this.store.dispatch(SearchFormActions.addNameOrValue({text: this.newNameOrValue}));
    this.newNameOrValue = '';
  }

  onDeleteText() {
    this.store.dispatch(SearchFormActions.addNameOrValue({text: ''}));
  }

  onAddAttribute() {
    this.store.dispatch(SearchFormActions.changeAttributeValue({typeId: this.newAttributeType, value: this.newAttributeValue}));
    this.newAttributeType = '';
    this.newAttributeValue = '';
    this.newFilterType = this.defaultFilterType;
  }

  onDeleteAttribute(typeId: string) {
    this.store.dispatch(SearchFormActions.deleteAttributeType({typeId}));
  }

  getAttributeTypeName(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeType(typeId)).pipe(map(at => at.name));
  }
}
