import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as SearchActions from 'src/app/display/store/search.actions';

import { Guid } from 'src/app/shared/guid';
import { SearchAttribute } from '../search-attribute.model';
import { SearchConnection } from '../search-connection.model';

@Component({
  selector: 'app-search-neighbor',
  templateUrl: './search-neighbor.component.html',
  styleUrls: ['./search-neighbor.component.scss']
})
export class SearchNeighborComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(
      withLatestFrom(this.availableItemTypes)
      ).subscribe(params => {
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
    });
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get itemType(): Guid {
    return this.form.value.ItemType;
  }

  get configurationItem() {
    return this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem));
  }

  get availableItemTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectItemTypes));
  }

  get allowedAttributeTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectAttributeTypesForItemType, this.form.value.ItemType));
  }

  get selectedAttributeTypes(): Guid[] {
    return this.form.value.ExtraSearch.Attributes.map((attributeType: SearchAttribute) => attributeType.attributeTypeId);
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(select(fromSelectMetaData.selectConnectionTypesForLowerItemType,
      { itemType: { TypeId: this.form.value.ItemType } }
    ));
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(select(fromSelectMetaData.selectConnectionTypesForUpperItemType,
      { itemType: { TypeId: this.form.value.ItemType } }
    ));
  }

  get extraSearch() {
    return this.form.get('ExtraSearch') as FormGroup;
  }

  onSubmit() {
    if (this.extraSearch.enabled) {
      this.extraSearch.get('ItemType').setValue(this.form.value.ItemType);
    }
    console.log(this.form.value);
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

  onAddConnectionToLower(connection: SearchConnection) {}

  onChangeConnectionToLowerCount(value: {index: number, count: string}) {}

  onDeleteConnectionToLower(index: number) {}

  toggleExtraSearch() {
    if (this.extraSearch.enabled) {
      this.extraSearch.disable();
    } else {
      this.extraSearch.enable();
    }
  }

  onAddAttributeType(attributeTypeId: Guid) {
    (this.extraSearch.get('Attributes') as FormArray).push(this.fb.group(
      {AttributeTypeId: attributeTypeId, AttributeValue: ''}
    ));
  }

}
