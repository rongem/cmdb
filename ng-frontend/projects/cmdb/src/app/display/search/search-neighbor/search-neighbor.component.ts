import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, withLatestFrom, take, switchMap } from 'rxjs/operators';
import { Guid, SearchAttribute, NeighborSearch, SearchConnection, MetaDataSelectors, SearchActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';
import * as fromSelectNeighbor from 'projects/cmdb/src/app/display/store/neighbor.selectors';
import * as SearchFormActions from 'projects/cmdb/src/app/display/store/search-form.actions';

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
      withLatestFrom(this.availableItemTypes, this.searchState.pipe(map(state => state.form))),
      ).subscribe(([params, itemTypes, oldForm]) => {
        if (oldForm.sourceItem === params[0].id) { // restore old form content if reused for same item
          this.form = this.fb.group({
            itemType: oldForm.itemTypeId,
            sourceItem: Guid.parse(params.id).toString(),
            maxLevels: oldForm.maxLevels,
            searchDirection: oldForm.searchDirection,
            extraSearch: this.fb.group({
              nameOrValue: oldForm.extraSearch.nameOrValue,
              itemType: oldForm.extraSearch.itemTypeId,
              attributes: this.fb.array(this.createAttibuteFormGroups(oldForm.extraSearch.attributes)),
              connectionsToUpper: this.createConnectionFormGroups(oldForm.extraSearch.connectionsToUpper),
              connectionsToLower: this.createConnectionFormGroups(oldForm.extraSearch.connectionsToLower),
              responsibleToken: oldForm.extraSearch.responsibleToken,
            })
          });
        } else { // clear form content
          this.form = this.fb.group({
            itemType: itemTypes[0].id,
            sourceItem: Guid.parse(params.id).toString(),
            maxLevels: 5,
            searchDirection: 0,
            extraSearch: this.fb.group({
              nameOrValue: '',
              itemTypeId: undefined,
              attributes: this.fb.array([]),
              connectionsToUpper: this.fb.array([]),
              connectionsToLower: this.fb.array([]),
              responsibleToken: '',
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
        connectionType: connection.connectionTypeId,
        configurationItemType: connection.configurationItemTypeId,
        count: connection.count,
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
    return this.store.select(MetaDataSelectors.selectSingleItemType, this.form.value.ItemType);
  }

  get itemTypeBackColor() {
    return this.selectedItemType.pipe(
      map(itemType => itemType ? itemType.backColor : 'inherit'),
    );
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get availableItemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get allowedAttributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType, this.form.value.ItemType);
  }

  get selectedAttributeTypes(): string[] {
    return this.extraSearch.value.Attributes.map((attributeType: SearchAttribute) => attributeType.typeId);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemType, this.form.value.ItemType),
      map(itemType => ({ itemType})),
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForLowerItemType, itemType)),
    );
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemType, this.form.value.ItemType),
      map(itemType => ({ itemType})),
      switchMap(itemType => this.store.select(MetaDataSelectors.selectConnectionTypesForUpperItemType, itemType)),
    );
  }

  get extraSearch() {
    return this.form.get('extraSearch') as FormGroup;
  }

  get searchState() {
    return this.store.select(fromSelectNeighbor.getState);
  }

  onSubmit() {
    if (this.extraSearch.enabled) {
      this.extraSearch.get('itemType').setValue(this.form.value.ItemType);
    }
    console.log(this.form.value);
    this.store.dispatch(SearchActions.performNeighborSearch({searchContent: this.form.value as NeighborSearch}));
  }

  onResetForm() {
    this.form.reset();
  }

  onAddConnectionToUpper(connection: {connectionTypeId: string, itemTypeId?: string}) {
    (this.extraSearch.get('connectionsToUpper') as FormArray).push(
      this.fb.group({
        connectionType: connection.connectionTypeId,
        configurationItemType: connection.itemTypeId,
        count: '1',
      })
    );
  }

  onChangeConnectionToUpperCount(value: {index: number, count: string}) {
    (this.extraSearch.get('connectionsToUpper') as FormArray).get(value.index.toString()).get('Count').patchValue(value.count);
  }

  onDeleteConnectionToUpper(index: number) {
    (this.extraSearch.get('connectionsToUpper') as FormArray).removeAt(index);
  }

  onAddConnectionToLower(connection: {connectionTypeId: string, itemTypeId?: string}) {
    (this.extraSearch.get('connectionsToLower') as FormArray).push(
      this.fb.group({
        connectionType: connection.connectionTypeId,
        configurationItemType: connection.itemTypeId,
        count: '1',
      })
    );
  }

  onChangeConnectionToLowerCount(value: {index: number, count: string}) {
    (this.extraSearch.get('connectionsToLower') as FormArray).get(value.index.toString()).get('Count').patchValue(value.count);
  }

  onDeleteConnectionToLower(index: number) {
    (this.extraSearch.get('connectionsToLower') as FormArray).removeAt(index);
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

  onAddAttributeType(attributeTypeId: string) {
    this.attributes.push(this.fb.group({
      typeId: attributeTypeId,
      value: ''
    }));
  }

  onChangeAttributeValue(value: {attributeTypeId: string, attributeValue: string}) {
    const formGroup = this.attributes.controls.find(c => c.get('typeId').value === value.attributeTypeId);
    if (!formGroup) {

    }
    formGroup.patchValue(value);
  }

  onDeleteAttributeType(attributeTypeId: string) {
    this.attributes.controls = this.attributes.controls.filter(c => c.get('typeId').value !== attributeTypeId);
  }

}
