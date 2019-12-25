import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, withLatestFrom, take, mergeMap, tap, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as fromSelectNeighbor from 'src/app/display/store/neighbor.selectors';
import * as SearchActions from 'src/app/display/store/search.actions';

import { Guid } from 'src/app/shared/guid';
import { SearchAttribute } from '../objects/search-attribute.model';
import { NeighborSearch } from '../objects/neighbor-search.model';
import { SearchConnection } from '../objects/search-connection.model';

@Component({
  selector: 'app-search-neighbor',
  templateUrl: './search-neighbor.component.html',
  styleUrls: ['./search-neighbor.component.scss']
})
export class SearchNeighborComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.pipe(
      withLatestFrom(this.availableItemTypes),
      withLatestFrom(this.searchState.pipe(map(state => state.form))),
      ).subscribe(values => {
        const params = values[0];
        const oldForm = values[1];
        if (oldForm.SourceItem === params[0].id) { // restore old form content if reused for same item
          this.form = this.fb.group({
            ItemType: oldForm.ItemType,
            SourceItem: params[0].id,
            MaxLevels: oldForm.MaxLevels,
            SearchDirection: oldForm.SearchDirection,
            ExtraSearch: this.fb.group({
              NameOrValue: oldForm.ExtraSearch.NameOrValue,
              ItemType: oldForm.ExtraSearch.ItemType,
              Attributes: this.fb.array(this.createAttibuteFormGroups(oldForm.ExtraSearch.Attributes)),
              ConnectionsToUpper: this.createConnectionFormGroups(oldForm.ExtraSearch.ConnectionsToUpper),
              ConnectionsToLower: this.createConnectionFormGroups(oldForm.ExtraSearch.ConnectionsToLower),
              ResponsibleToken: oldForm.ExtraSearch.ResponsibleToken,
            })
          });
        } else { // clear form content
          this.form = this.fb.group({
            ItemType: params[1][0].TypeId,
            SourceItem: params[0].id,
            MaxLevels: 5,
            SearchDirection: 0,
            ExtraSearch: this.fb.group({
              NameOrValue: '',
              ItemType: undefined,
              Attributes: this.fb.array([]),
              ConnectionsToUpper: this.fb.array([]),
              ConnectionsToLower: this.fb.array([]),
              ResponsibleToken: '',
            }),
          });
          this.extraSearch.disable();
        }
    });
    this.actions$.pipe(
      ofType(SearchActions.setNeighborSearchResultList),
      take(1),
    ).subscribe(() => {
      this.router.navigate(['display', 'configuration-item', this.form.value.SourceItem, 'neighbors']);
    });
  }

  createAttibuteFormGroups(attributes: SearchAttribute[]) {
    const attributeGroups: FormGroup[] = [];
    attributes.forEach(attribute => attributeGroups.push(
      this.fb.group({
        AttributeTypeId: attribute.AttributeTypeId,
        AttributeValue: attribute.AttributeValue,
      })
    ));
    return attributeGroups;
  }

  createConnectionFormGroups(connections: SearchConnection[]) {
    const connectionGroups: FormGroup[] = [];
    connections.forEach(connection => connectionGroups.push(
      this.fb.group({
        ConnectionType: connection.ConnectionType,
        ConfigurationItemType: connection.ConfigurationItemType,
        Count: connection.Count,
      })
    ));
    return connectionGroups;
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get selectedItemType() {
    return this.store.select(fromSelectMetaData.selectSingleItemType, this.form.value.ItemType);
  }

  get itemTypeBackColor() {
    return this.selectedItemType.pipe(
      map(itemType => itemType ? itemType.TypeBackColor : 'inherit'),
    );
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get availableItemTypes() {
    return this.store.select(fromSelectMetaData.selectItemTypes);
  }

  get allowedAttributeTypes() {
    return this.store.select(fromSelectMetaData.selectAttributeTypesForItemType, this.form.value.ItemType);
  }

  get selectedAttributeTypes(): Guid[] {
    return this.extraSearch.value.Attributes.map((attributeType: SearchAttribute) => attributeType.AttributeTypeId);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(
      select(fromSelectMetaData.selectSingleItemType, this.form.value.ItemType),
      map(itemType => ({ itemType})),
      switchMap(itemType => this.store.select(fromSelectMetaData.selectConnectionTypesForLowerItemType, itemType)),
    );
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(
      select(fromSelectMetaData.selectSingleItemType, this.form.value.ItemType),
      map(itemType => ({ itemType})),
      switchMap(itemType => this.store.select(fromSelectMetaData.selectConnectionTypesForUpperItemType, itemType)),
    );
  }

  get extraSearch() {
    return this.form.get('ExtraSearch') as FormGroup;
  }

  get searchState() {
    return this.store.select(fromSelectNeighbor.getState);
  }

  onSubmit() {
    if (this.extraSearch.enabled) {
      this.extraSearch.get('ItemType').setValue(this.form.value.ItemType);
    }
    console.log(this.form.value);
    this.store.dispatch(SearchActions.performNeighborSearch({searchContent: this.form.value as NeighborSearch}));
  }

  onResetForm() {
    this.form.reset();
  }

  onAddConnectionToUpper(connection: {connectionTypeId: Guid, itemTypeId?: Guid}) {
    (this.extraSearch.get('ConnectionsToUpper') as FormArray).push(
      this.fb.group({
        ConnectionType: connection.connectionTypeId,
        ConfigurationItemType: connection.itemTypeId,
        Count: '1',
      })
    );
  }

  onChangeConnectionToUpperCount(value: {index: number, count: string}) {
    (this.extraSearch.get('ConnectionsToUpper') as FormArray).get(value.index.toString()).get('Count').patchValue(value.count);
  }

  onDeleteConnectionToUpper(index: number) {
    (this.extraSearch.get('ConnectionsToUpper') as FormArray).removeAt(index);
  }

  onAddConnectionToLower(connection: {connectionTypeId: Guid, itemTypeId?: Guid}) {
    (this.extraSearch.get('ConnectionsToLower') as FormArray).push(
      this.fb.group({
        ConnectionType: connection.connectionTypeId,
        ConfigurationItemType: connection.itemTypeId,
        Count: '1',
      })
    );
  }

  onChangeConnectionToLowerCount(value: {index: number, count: string}) {
    (this.extraSearch.get('ConnectionsToLower') as FormArray).get(value.index.toString()).get('Count').patchValue(value.count);
  }

  onDeleteConnectionToLower(index: number) {
    (this.extraSearch.get('ConnectionsToLower') as FormArray).removeAt(index);
  }

  toggleExtraSearch() {
    if (this.extraSearch.enabled) {
      this.extraSearch.disable();
    } else {
      this.extraSearch.enable();
    }
  }

  get attributes() {
    return this.extraSearch.get('Attributes') as FormArray;
  }

  onAddAttributeType(attributeTypeId: Guid) {
    this.attributes.push(this.fb.group({
      AttributeTypeId: attributeTypeId,
      AttributeValue: ''
    }));
  }

  onChangeAttributeValue(value: {attributeTypeId: Guid, attributeValue: string}) {
    const formGroup = this.attributes.controls.find(c => c.get('AttributeTypeId').value === value.attributeTypeId);
    if (!formGroup) {

    }
    formGroup.patchValue(value);
  }

  onDeleteAttributeType(attributeTypeId: Guid) {
    this.attributes.controls = this.attributes.controls.filter(c => c.get('AttributeTypeId').value !== attributeTypeId);
  }

}
