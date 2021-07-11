import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, withLatestFrom, take, switchMap } from 'rxjs/operators';
import { SearchAttribute, NeighborSearch, SearchConnection, MetaDataSelectors, SearchActions } from 'backend-access';

import { DisplaySelectors, ItemSelectors, NeighborSearchSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-search-neighbor',
  templateUrl: './search-neighbor.component.html',
  styleUrls: ['./search-neighbor.component.scss']
})
export class SearchNeighborComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.pipe(
      withLatestFrom(this.availableItemTypes, this.searchState.pipe(map(state => state.form))),
      ).subscribe(([params, itemTypes, oldForm]) => {
        if (oldForm.sourceItem === params.id) { // restore old form content if reused for same item
          this.form = this.fb.group({
            itemTypeId: oldForm.itemTypeId,
            sourceItem: params.id,
            maxLevels: oldForm.maxLevels,
            searchDirection: oldForm.searchDirection,
            extraSearch: this.fb.group({
              nameOrValue: oldForm.extraSearch.nameOrValue,
              itemTypeId: oldForm.extraSearch.itemTypeId,
              attributes: this.fb.array(this.createAttibuteFormGroups(oldForm.extraSearch.attributes)),
              connectionsToUpper: this.createConnectionFormGroups(oldForm.extraSearch.connectionsToUpper),
              connectionsToLower: this.createConnectionFormGroups(oldForm.extraSearch.connectionsToLower),
              responsibleToken: oldForm.extraSearch.responsibleToken,
            })
          });
        } else { // clear form content
          this.form = this.fb.group({
            itemTypeId: itemTypes[0].id,
            sourceItem: params.id,
            maxLevels: 5,
            searchDirection: 0,
            extraSearch: this.fb.group({
              nameOrValue: '',
              itemTypeId: itemTypes[0].id,
              attributes: this.fb.array([]),
              connectionsToUpper: this.fb.array([]),
              connectionsToLower: this.fb.array([]),
              responsibleToken: '',
            }),
          });
          this.extraSearch.disable();
        }
    });
  }

  createAttibuteFormGroups(attributes: SearchAttribute[]) {
    const attributeGroups: FormGroup[] = [];
    attributes.forEach(attribute => attributeGroups.push(
      this.fb.group({
        typeId: attribute.typeId,
        value: attribute.value,
      })
    ));
    return attributeGroups;
  }

  createConnectionFormGroups(connections: SearchConnection[]) {
    const connectionGroups: FormGroup[] = [];
    connections.forEach(connection => connectionGroups.push(
      this.fb.group({
        connectionTypeId: connection.connectionTypeId,
        configurationItemTypeId: connection.configurationItemTypeId,
        count: connection.count,
      })
    ));
    return connectionGroups;
  }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get itemTypeId(): string {
    return this.form.value.itemTypeId;
  }

  get selectedItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId));
  }

  get itemTypeBackColor() {
    return this.selectedItemType.pipe(
      map(itemType => itemType ? itemType.backColor : 'inherit'),
    );
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get availableItemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get allowedAttributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.itemTypeId));
  }

  get selectedAttributeTypes(): string[] {
    if (this.extraSearch && this.extraSearch.value.attributes) {
      return this.extraSearch.value.attributes?.map((attributeType: SearchAttribute) => attributeType.typeId);
    }
    return [];
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId)).pipe(
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForLowerItemType(itemType))),
    );
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId)).pipe(
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForUpperItemType(itemType))),
    );
  }

  get extraSearch() {
    return this.form.get('extraSearch') as FormGroup;
  }

  get searchState() {
    return this.store.select(NeighborSearchSelectors.getState);
  }

  get noSearchResult() {
    return this.store.select(NeighborSearchSelectors.getState).pipe(map(state => state.noSearchResult));
  }

  get searching() {
    return this.store.select(NeighborSearchSelectors.getState).pipe(map(state => state.searching));
  }

  onSubmit() {
    this.actions$.pipe(
      ofType(SearchActions.setNeighborSearchResultList),
      take(1),
    ).subscribe(action => {
      if (action.resultList.length > 0) {
        this.router.navigate(['display', 'configuration-item', this.form.value.sourceItem, 'neighbors']);
      }
    });
    if (this.extraSearch.enabled) {
      this.extraSearch.get('itemTypeId').setValue(this.itemTypeId);
    }
    this.store.dispatch(SearchActions.performNeighborSearch({searchContent: this.form.value as NeighborSearch}));
  }

  onResetForm() {
    this.form.reset();
  }

  onChangeItemTypeId() {
    this.connectionsToLower.clear();
    this.connectionsToUpper.clear();
    this.attributes.clear();
  }

  onAddConnectionToUpper(connection: {connectionTypeId: string; itemTypeId?: string}) {
    this.connectionsToUpper.push(
      this.fb.group({
        connectionTypeId: connection.connectionTypeId,
        configurationItemTypeId: connection.itemTypeId,
        count: '1',
      })
    );
  }

  onChangeConnectionToUpperCount(value: {index: number; count: string}) {
    this.connectionsToUpper.get(value.index.toString()).get('count').patchValue(value.count);
  }

  onDeleteConnectionToUpper(index: number) {
    this.connectionsToUpper.removeAt(index);
  }

  onAddConnectionToLower(connection: {connectionTypeId: string; itemTypeId?: string}) {
    this.connectionsToLower.push(
      this.fb.group({
        connectionTypeId: connection.connectionTypeId,
        configurationItemTypeId: connection.itemTypeId,
        count: '1',
      })
    );
  }

  onChangeConnectionToLowerCount(value: {index: number; count: string}) {
    this.connectionsToLower.get(value.index.toString()).get('count').patchValue(value.count);
  }

  onDeleteConnectionToLower(index: number) {
    this.connectionsToLower.removeAt(index);
  }

  toggleExtraSearch() {
    if (this.extraSearch.enabled) {
      this.extraSearch.disable();
    } else {
      this.extraSearch.enable();
    }
  }

  get attributes() {
    return this.extraSearch.get('attributes') as FormArray;
  }

  get connectionsToUpper() {
    return this.extraSearch.get('connectionsToUpper') as FormArray;
  }

  get connectionsToLower() {
    return this.extraSearch.get('connectionsToLower') as FormArray;
  }

  onAddAttributeType(attributeTypeId: string) {
    this.attributes.push(this.fb.group({
      typeId: attributeTypeId,
      value: ''
    }));
  }

  onChangeAttributeValue(value: {typeId: string; value: string}) {
    const formGroup = this.attributes.controls.find(c => c.get('typeId').value === value.typeId);
    if (!formGroup) {

    }
    formGroup.patchValue(value);
  }

  onDeleteAttributeType(attributeTypeId: string) {
    this.attributes.controls = this.attributes.controls.filter(c => c.get('typeId').value !== attributeTypeId);
  }

}
