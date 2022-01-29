import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, SearchConnection } from 'backend-access';
import { iif, map, of, Subscription, switchMap, take, withLatestFrom } from 'rxjs';

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
  newChangedBefore = this.getRelativeDate(-1, 0);
  newChangedAfter = this.getRelativeDate(0, -1);
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
        this.store.select(MetaDataSelectors.selectUpperItemTypesForItemTypeAndConnectionType(itemType, connectionType))
      ),
      // withLatestFrom(this.form$),
      // map(([itemTypes, form]) => itemTypes.filter(itemType => !form.connectionsToUpper.find(
      //   conn => conn.connectionTypeId === this.newConnectionTypeToUpper && conn.itemTypeId === itemType.id
      // ))),
    );
  }

  get itemTypesToLowerForCurrentItemType() {
    return this.searchItemType.pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionType(this.newConnectionTypeToLower))),
      switchMap(([itemType, connectionType]) =>
        this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType(itemType, connectionType))
      ),
      // withLatestFrom(this.form$),
      // map(([itemTypes, form]) => itemTypes.filter(itemType => !form.connectionsToLower.find(
      //   conn => conn.connectionTypeId === this.newConnectionTypeToLower && conn.itemTypeId === itemType.id
      // ))),
    );
  }

  private get defaultFilterType() {
    return '';
  }

  ngOnInit(): void {
    this.subscription = this.actions$.pipe(ofType(
      SearchFormActions.addItemType, SearchFormActions.deleteItemType, SearchFormActions.changeAttributeValue, SearchFormActions.deleteAttributeType,
      SearchFormActions.addConnectionTypeToLower, SearchFormActions.deleteConnectionTypeToLower,
      SearchFormActions.addConnectionTypeToUpper, SearchFormActions.deleteConnectionTypeToUpper,
    )).subscribe(() => {
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
      itemTypeId: this.newItemTypeToLower === '{any type}' ? undefined : this.newItemTypeToLower,
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
      withLatestFrom(iif(() => !!connection.itemTypeId,
        this.store.select(MetaDataSelectors.selectSingleItemType(connection.itemTypeId)), of(undefined))
      ),
      map(([connectionType, itemType]) => connectionType.name + ' ' + (itemType ? itemType.name : '(any') ),
    );
  }

  onAddConnectionToUpper() {
    const searchContent: SearchConnection = {
      connectionTypeId: this.newConnectionTypeToUpper,
      itemTypeId: this.newItemTypeToUpper === '{any type}' ? undefined : this.newItemTypeToUpper,
      count: this.newConnectionCountToUpper,
    };
    this.store.dispatch(SearchFormActions.addConnectionTypeToUpper(searchContent));
    this.newConnectionCountToUpper = '1';
    this.newConnectionTypeToUpper = '';
    this.newItemTypeToUpper = '';
    this.newFilterType = this.defaultFilterType;
  }

  onDeleteConnectionToUpper(index: number) {
    this.store.dispatch(SearchFormActions.deleteConnectionTypeToUpper({index}));
  }

  getConnectionToUpperContent(connection: SearchConnection) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connection.connectionTypeId)).pipe(
      withLatestFrom(iif(() => !!connection.itemTypeId,
        this.store.select(MetaDataSelectors.selectSingleItemType(connection.itemTypeId)), of(undefined))
      ),
      map(([connectionType, itemType]) => connectionType.reverseName + ' ' + (itemType ? itemType.name : '(any)') ),
    );
  }

  onAddChangedBefore() {
    const date = new Date(Date.parse(this.newChangedBefore));
    this.store.dispatch(SearchFormActions.setChangedBefore({date}));
    this.newFilterType = '';
    this.newChangedBefore = this.getRelativeDate(-1, 0);
  }

  onDeleteChangedBefore() {
    this.store.dispatch(SearchFormActions.setChangedBefore({date: undefined}));
  }

  onAddChangedAfter() {
    const date = new Date(Date.parse(this.newChangedAfter));
    this.store.dispatch(SearchFormActions.setChangedAfter({date}));
    this.newFilterType = '';
    this.newChangedAfter = this.getRelativeDate(0, -1);
  }

  onDeleteChangedAfter() {
    this.store.dispatch(SearchFormActions.setChangedAfter({date: undefined}));
  }

  validateDateString(dateString: string, maxDaysBefore: number) {
    const d = Date.parse(dateString);
    if (isNaN(d)) {
      return false;
    }
    const date = new Date(d);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - maxDaysBefore);
    return date.valueOf() < maxDate.valueOf();
  }

  onAddResponsibility() {
    this.userName.pipe(
      take(1),
    ).subscribe(token => {
      this.store.dispatch(SearchFormActions.setResponsibility({token}));
    });
  }

  onDeleteResponsibility() {
    this.store.dispatch(SearchFormActions.setResponsibility({token: undefined}));
  }

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
    this.newChangedBefore = this.getRelativeDate(-1, 0);
    this.newChangedAfter = this.getRelativeDate(0, -1);
  }

  private getRelativeDate(days: number, months: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

}
