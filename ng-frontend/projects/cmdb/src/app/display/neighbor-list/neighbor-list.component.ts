import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { iif, map, of, skipWhile, Subscription, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { ConfigurationItem, MetaDataSelectors, NeighborSearch, SearchActions, SearchConnection } from 'backend-access';
import { ItemSelectors, NeighborSearchActions, NeighborSearchSelectors } from '../../shared/store/store.api';
import { Actions, ofType } from '@ngrx/effects';

@Component({
    selector: 'app-neighbor-list',
    templateUrl: './neighbor-list.component.html',
    styleUrls: ['./neighbor-list.component.scss'],
    standalone: false
})
export class NeighborListComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
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
  private subscriptions: Subscription[] = [];

  constructor(private store: Store, private fb: UntypedFormBuilder, private actions$: Actions) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get noSearchResult() {
    return this.store.select(NeighborSearchSelectors.noSearchResult);
  }

  get searching() {
    return this.store.select(NeighborSearchSelectors.searching);
  }

  get search() {
    return this.store.select(NeighborSearchSelectors.form);
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get searchItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.form.value.itemTypeId));
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get itemTypeBackColor() {
    return this.searchItemType.pipe(
      map(itemType => itemType ? itemType.backColor : 'inherit'),
    );
  }

  get selectedAttributeTypes() {
    return this.store.select(NeighborSearchSelectors.searchUsedAttributeTypes);
  }

  get allowedAttributeTypeList() {
    return this.form.value?.itemTypeId ? this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.form.value.itemTypeId)) : of([]);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.searchItemType.pipe(
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForLowerItemType(itemType)))
    );
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.searchItemType.pipe(
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForUpperItemType(itemType)))
    );
  }

  get itemTypesToUpperForCurrentItemType() {
    return this.searchItemType.pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionType(this.newConnectionTypeToUpper))),
      switchMap(([itemType, connectionType]) =>
        this.store.select(MetaDataSelectors.selectUpperItemTypesForItemTypeAndConnectionType(itemType, connectionType))
      ),
    );
  }

  get itemTypesToLowerForCurrentItemType() {
    return this.searchItemType.pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionType(this.newConnectionTypeToLower))),
      switchMap(([itemType, connectionType]) =>
        this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType(itemType, connectionType))
      ),
    );
  }

  get extraSearch() {
    return this.search.pipe(map(form => form.extraSearch));
  }

  get resultList() {
    return this.store.select(NeighborSearchSelectors.resultList);
  }

  get resultListFull() {
    return this.resultList.pipe(map(items => items.map(item => item.fullItem)));
  }

  get displayedAttributeTypesList() {
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.form.value.itemTypeId));
  }

  get displayedConnectionTypesList() { return []; }

  ngOnInit(): void {
    this.itemReady.pipe(
      skipWhile(ready => !ready),
      switchMap(() => this.configurationItem),
      take(1),
      withLatestFrom(this.store.select(MetaDataSelectors.selectItemTypes)),
    ).subscribe(([item, itemTypes]) => {
      this.form = this.fb.group({
        sourceItem: this.fb.control(item.id, Validators.required),
        itemTypeId: this.fb.control(itemTypes[0]?.id ?? '', Validators.required),
        maxLevels: this.fb.control(1, [Validators.required, Validators.min(1), Validators.max(5)]),
        searchDirection: this.fb.control(0, [Validators.required, Validators.min(-1), Validators.max(1)]),
      });
      this.store.dispatch(NeighborSearchActions.setNeighborSearch(this.form.value as NeighborSearch));
      this.subscriptions.push(this.form.valueChanges.subscribe((formValue: NeighborSearch) => {
        this.store.dispatch(NeighborSearchActions.setNeighborSearch(formValue));
      }));
    });
    this.subscriptions.push(this.actions$.pipe(
      ofType(NeighborSearchActions.addAttributeValue, NeighborSearchActions.addConnectionTypeToLower, NeighborSearchActions.addConnectionTypeToUpper,
        NeighborSearchActions.addItemType, NeighborSearchActions.addNameOrValue, NeighborSearchActions.deleteAttributeType,
        NeighborSearchActions.deleteConnectionTypeToLower, NeighborSearchActions.deleteConnectionTypeToUpper, NeighborSearchActions.deleteItemType,
        NeighborSearchActions.searchChangeMetaData, NeighborSearchActions.setChangedBefore, NeighborSearchActions.setNeighborSearch,
        NeighborSearchActions.setResponsibility
      ),
      withLatestFrom(this.store.select(NeighborSearchSelectors.form)),
      tap(([action, searchContent]) => this.store.dispatch(SearchActions.performNeighborSearch({searchContent}))),
    ).subscribe());
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onChangeText() {
    this.store.dispatch(NeighborSearchActions.addNameOrValue({text: this.newNameOrValue}));
    this.resetForm();
  }
  onDeleteText() {
    this.store.dispatch(NeighborSearchActions.addNameOrValue({text: undefined}));
  }

  onAddAttribute() {
    this.store.dispatch(NeighborSearchActions.addAttributeValue({typeId: this.newAttributeType, value: this.newAttributeValue}));
    this.resetForm();
  }
  onDeleteAttribute(typeId: string) {
    this.store.dispatch(NeighborSearchActions.deleteAttributeType({typeId}));
  }

  onAddConnectionToLower() {
    this.store.dispatch(NeighborSearchActions.addConnectionTypeToLower({
      connectionTypeId: this.newConnectionTypeToLower,
      itemTypeId: this.newItemTypeToLower,
      count: this.newConnectionCountToLower,
    }));
    this.resetForm();
  }
  onDeleteConnectionToLower(index: number) {
    this.store.dispatch(NeighborSearchActions.deleteConnectionTypeToLower({index}));
  }
  onAddConnectionToUpper() {
    this.store.dispatch(NeighborSearchActions.addConnectionTypeToUpper({
      connectionTypeId: this.newConnectionTypeToUpper,
      itemTypeId: this.newItemTypeToUpper,
      count: this.newConnectionCountToUpper,
    }));
    this.resetForm();
  }
  onDeleteConnectionToUpper(index: number) {
    this.store.dispatch(NeighborSearchActions.deleteConnectionTypeToUpper({index}));
  }

  onAddChangedBefore() {
    this.store.dispatch(NeighborSearchActions.setChangedBefore({date: new Date(Date.parse(this.newChangedBefore))}));
    this.resetForm();
  }
  onDeleteChangedBefore() {
    this.store.dispatch(NeighborSearchActions.setChangedBefore({date: undefined}));
  }

  onAddChangedAfter() {
    this.store.dispatch(NeighborSearchActions.setChangedAfter({date: new Date(Date.parse(this.newChangedBefore))}));
    this.resetForm();
  }
  onDeleteChangedAfter() {
    this.store.dispatch(NeighborSearchActions.setChangedAfter({date: undefined}));
  }

  onAddResponsibility() {
    this.userName.pipe(take(1)).subscribe(token => {
      this.store.dispatch(NeighborSearchActions.setResponsibility({token}));
    });
  }
  onDeleteResponsibility() {
    this.store.dispatch(NeighborSearchActions.setResponsibility({token: undefined}));
  }

  getAttributeTypeName(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeType(typeId)).pipe(map(at => at.name));
  }

  getConnectionToLowerContent(connection: SearchConnection) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connection.connectionTypeId)).pipe(
      withLatestFrom(iif(() => !!connection.itemTypeId,
        this.store.select(MetaDataSelectors.selectSingleItemType(connection.itemTypeId)), of(undefined))
      ),
      map(([connectionType, itemType]) => connectionType.name + ' ' + (itemType ? itemType.name : '(any') ),
    );
  }

  getConnectionToUpperContent(connection: SearchConnection) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connection.connectionTypeId)).pipe(
      withLatestFrom(iif(() => !!connection.itemTypeId,
        this.store.select(MetaDataSelectors.selectSingleItemType(connection.itemTypeId)), of(undefined))
      ),
      map(([connectionType, itemType]) => connectionType.reverseName + ' ' + (itemType ? itemType.name : '(any)') ),
    );
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

  getAttributeValue(item: ConfigurationItem, attributeTypeId: string) {
    return item.attributes?.find(a => a.typeId === attributeTypeId)?.value ?? '';
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
