import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, SearchContent, SearchActions } from 'backend-access';
import { map } from 'rxjs';

import { SearchFormActions, SearchFormSelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {
  options = [];
  control: {value: string};
  newFilterType = 'nameOrValue';

  constructor(private store: Store) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

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

  ngOnInit(): void {
  }

  onChangeText(text: string) {
    this.store.dispatch(SearchFormActions.addNameOrValue({text}));
  }


}
