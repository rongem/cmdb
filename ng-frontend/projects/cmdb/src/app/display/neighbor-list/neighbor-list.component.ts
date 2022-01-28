import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { iif, map, of, skipWhile, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import { MetaDataSelectors, NeighborSearch, SearchActions, SearchConnection, SearchContent } from 'backend-access';
import { ItemSelectors, NeighborSearchSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-neighbor-list',
  templateUrl: './neighbor-list.component.html',
  styleUrls: ['./neighbor-list.component.scss']
})
export class NeighborListComponent implements OnInit, OnDestroy {
  form: FormGroup;
  search = new NeighborSearch();
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


  constructor(private store: Store, private fb: FormBuilder) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
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

  get extraSearch() {
    return this.search.extraSearch ?? new SearchContent();
  }

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
      this.search = {
        sourceItem: item.id,
        itemTypeId: itemTypes[0]?.id ?? '',
        maxLevels: 1,
        searchDirection: 0,
        extraSearch: {
          nameOrValue: undefined,
          itemTypeId: itemTypes[0]?.id,
          attributes: [],
          connectionsToUpper: [],
          connectionsToLower: [],
        }
      };
      this.subscription = this.form.valueChanges.subscribe(formValue => {
        if (this.search.itemTypeId !== formValue.itemTypeId) {
          this.search.itemTypeId = formValue.itemTypeId;
          this.search.extraSearch.itemTypeId = formValue.itemTypeId;
          this.search.extraSearch.attributes = [];
          this.search.extraSearch.connectionsToLower = [];
          this.search.extraSearch.connectionsToUpper = [];
        }
        this.search.sourceItem = formValue.sourceItem;
        this.search.maxLevels = +formValue.maxLevels;
        this.search.searchDirection = +formValue.searchDirection;
        this.performSearch();
      });
    });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  onChangeText() {
    this.extraSearch.nameOrValue = this.newNameOrValue;
    this.resetForm();
  }
  onDeleteText() {
    this.extraSearch.nameOrValue = undefined;
  }

  onAddAttribute() {
    this.extraSearch.attributes = this.extraSearch.attributes.filter(a => a.typeId !== this.newAttributeType);
    this.extraSearch.attributes.push({
      typeId: this.newAttributeType,
      value: this.newAttributeValue,
    });
    this.resetForm();
  }
  onDeleteAttribute(attributeTypeId: string) {
    this.extraSearch.attributes = this.extraSearch.attributes.filter(a => a.typeId !== attributeTypeId);
  }

  onAddConnectionToLower() {
    this.extraSearch.connectionsToLower = this.extraSearch.connectionsToLower.filter(connection => !(this.newItemTypeToLower ?
      connection.connectionTypeId === this.newConnectionTypeToLower && (!connection.itemTypeId || connection.itemTypeId === this.newItemTypeToLower) :
      connection.connectionTypeId === this.newConnectionTypeToLower)
    );
    this.extraSearch.connectionsToLower.push({
      connectionTypeId: this.newConnectionTypeToLower,
      itemTypeId: this.newItemTypeToLower,
      count: this.newConnectionCountToLower,
    });
    this.resetForm();
  }
  onDeleteConnectionToLower(index: number) {
    this.extraSearch.connectionsToLower.splice(index, 1);
  }
  onAddConnectionToUpper() {
    this.extraSearch.connectionsToUpper = this.extraSearch.connectionsToUpper.filter(connection => !(this.newItemTypeToUpper ?
      connection.connectionTypeId === this.newConnectionTypeToUpper && (!connection.itemTypeId || connection.itemTypeId === this.newItemTypeToUpper) :
      connection.connectionTypeId === this.newConnectionTypeToUpper)
    );
    this.extraSearch.connectionsToUpper.push({
      connectionTypeId: this.newConnectionTypeToUpper,
      itemTypeId: this.newItemTypeToUpper,
      count: this.newConnectionCountToUpper,
    });
    this.resetForm();
  }
  onDeleteConnectionToUpper(index: number) {
    this.extraSearch.connectionsToUpper.splice(index, 1);
  }

  onAddChangedBefore() {
    this.extraSearch.changedBefore = new Date(Date.parse(this.newChangedBefore));
    if (this.extraSearch.changedAfter && this.extraSearch.changedAfter.valueOf() < this.extraSearch.changedBefore.valueOf()) {
      this.extraSearch.changedAfter = undefined;
    }
    this.resetForm();
  }
  onDeleteChangedBefore() {
    this.extraSearch.changedBefore = undefined;
  }

  onAddChangedAfter() {
    this.extraSearch.changedAfter = new Date(Date.parse(this.newChangedAfter));
    if (this.extraSearch.changedBefore && this.extraSearch.changedAfter.valueOf() < this.extraSearch.changedBefore.valueOf()) {
      this.extraSearch.changedBefore = undefined;
    }
    this.resetForm();
  }
  onDeleteChangedAfter() {
    this.extraSearch.changedAfter = undefined;
  }

  onAddResponsibility() {
    this.userName.pipe(take(1)).subscribe(userName => {
      this.extraSearch.responsibleToken = userName;
    });
  }
  onDeleteResponsibility() {
    this.extraSearch.responsibleToken = undefined;
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

  private performSearch() {
    console.log(this.search);
    this.store.dispatch(SearchActions.performNeighborSearch({searchContent: this.search}));
  }

  private getRelativeDate(days: number, months: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

}
