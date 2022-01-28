import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { iif, map, of, skipUntil, skipWhile, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import { MetaDataSelectors, SearchConnection } from 'backend-access';
import { ItemSelectors, NeighborSearchSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-neighbor-list',
  templateUrl: './neighbor-list.component.html',
  styleUrls: ['./neighbor-list.component.scss']
})
export class NeighborListComponent implements OnInit {
  form: FormGroup;
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
    return this.form.get('extraSearch');
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
        extraSearch: this.fb.group({
          nameOrValue: this.fb.control(''),
          attributes: this.fb.array([]),
          connectionsToUpper: this.fb.array([]),
          connectionsToLower: this.fb.array([]),
          changedBefore: this.fb.control(''),
          changedAfter: this.fb.control(''),
          responsibleToken: this.fb.control(''),
        })
      });
    });
  }
  /*
    this.fb.group({
      typeId: this.fb.control('', Validators.required),
      value: this.fb.control(''),
    })
    this.fb.group({
      connectionTypeId: this.fb.control('', Validators.required),
      itemTypeId: this.fb.control(''),
      count: this.fb.control('1', Validators.required),
    })
    this.fb.group({
      connectionTypeId: this.fb.control('', Validators.required),
      itemTypeId: this.fb.control(''),
      count: this.fb.control('1', Validators.required),
    })
  */
   onChangeText() {
    this.extraSearch.get('nameOrValue').setValue(this.newNameOrValue);
    this.newFilterType = '';
    this.newNameOrValue = this.getRelativeDate(-1, 0);
   }
   onDeleteText() {
    this.extraSearch.get('nameOrValue').reset();
   }
   onAddAttribute() {
     this.allowedAttributeTypeList.pipe(take(1)).subscribe(attributeTypes => {
       (this.extraSearch.get('attributes') as FormArray).push(
         this.fb.group({
          typeId: this.fb.control(this.newAttributeType),
          value: this.fb.control(this.newAttributeValue),
        })
       );
       this.resetForm();
     });
   }
   onDeleteAttribute(attributeTypeId: string) {}
   onAddConnectionToLower() {}
   onDeleteConnectionToLower(index: number) {}
   onAddConnectionToUpper() {}
   onDeleteConnectionToUpper(index: number) {}
   onAddChangedBefore() {}
   onDeleteChangedBefore() {}
   onAddChangedAfter() {}
   onDeleteChangedAfter() {}
   onAddResponsibility() {}
  onDeleteResponsibility() {}

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

  private getRelativeDate(days: number, months: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

}
