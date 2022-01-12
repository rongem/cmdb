import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, SearchConnection } from 'backend-access';
import { iif, map, of, Subscription, switchMap, withLatestFrom } from 'rxjs';

import { SearchFormActions, SearchFormSelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit, OnDestroy {
  options = [];
  control: {value: string};
  newFilterType = '';
  newNameOrValue = '';
  newAttributeType = '';
  newAttributeValue = '';
  newConnectionTypeToLower = '';
  newItemTypeToLower = '';
  newConnectionCountToLower = '1';
  newConnectionTypeToUpper = '';
  newItemTypeToUpper = '';
  newConnectionCountToUpper = '1';
  private subscription: Subscription;

  constructor(private store: Store, private actions$: Actions) {
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

  get itemTypesToUpperForCurrentItemType() {
    return this.searchItemType.pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionType(this.newConnectionTypeToUpper))),
      switchMap(([itemType, connectionType]) =>
        this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType(itemType, connectionType))),
    );
  }

  get itemTypesToLowerForCurrentItemType() {
    return this.searchItemType.pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionType(this.newConnectionTypeToLower))),
      switchMap(([itemType, connectionType]) =>
        this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType(itemType, connectionType))),
    );
  }

  private get defaultFilterType() {
    return '';
  }

  ngOnInit(): void {
    this.subscription = this.actions$.pipe(ofType(SearchFormActions.addItemType, SearchFormActions.deleteItemType)).subscribe(() => {
        this.resetForm();
    });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  onChangeText() {
    this.store.dispatch(SearchFormActions.addNameOrValue({text: this.newNameOrValue}));
    this.newNameOrValue = '';
    this.newFilterType = this.defaultFilterType;
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

  onAddConnectionToLower() {
    const searchContent: SearchConnection = {
      connectionTypeId: this.newConnectionTypeToLower,
      configurationItemTypeId: this.newItemTypeToLower === '{any type}' ? undefined : this.newItemTypeToLower,
      count: this.newConnectionCountToLower,
    };
    this.store.dispatch(SearchFormActions.addConnectionTypeToLower(searchContent));
    this.newConnectionCountToLower = '1';
    this.newConnectionTypeToLower = '';
    this.newItemTypeToLower = '';
    this.newFilterType = this.defaultFilterType;
  }

  onDeleteConnectionToLower(index: number) {
    this.store.dispatch(SearchFormActions.deleteConnectionTypeToLower({index}));
  }

  getConnectionToLowerContent(connection: SearchConnection) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connection.connectionTypeId)).pipe(
      withLatestFrom(iif(() => !!connection.configurationItemTypeId,
        this.store.select(MetaDataSelectors.selectSingleItemType(connection.configurationItemTypeId)), of(undefined))
      ),
      map(([connectionType, itemType]) => connectionType.name + (itemType ? ' ' + itemType.name : '') ),
    );
  }

  onAddConnectionToUpper() {}

  private resetForm() {
    this.newFilterType = '';
    this.newConnectionTypeToLower = '';
    this.newItemTypeToLower = '';
    this.newConnectionCountToLower = '1';
    this.newConnectionTypeToUpper = '';
    this.newItemTypeToUpper = '';
    this.newConnectionCountToUpper = '1';
    this.newAttributeType = '';
    this.newAttributeValue = '';
  }

}
