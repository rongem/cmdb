import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, of } from 'rxjs';
import { ItemType } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { Rack } from '../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';

@Component({
    selector: 'app-rack-mount-form',
    templateUrl: './rack-mount-form.component.html',
    styleUrls: ['./rack-mount-form.component.scss'],
    standalone: false
})
export class RackMountFormComponent implements OnInit {
  @Input() rack: Rack;
  @Input() heightUnit: number;
  @Input() maxFreeHeightUnit: number;
  @Input() minFreeHeightUnit: number;
  @Output() mount = new EventEmitter<{heightUnits: string; rack: Rack; rackMountable: RackMountable}>();
  heightUnits: number[] = [];
  selectedTypeId: string;
  selectedModelId: string;

  constructor(private store: Store<fromApp.AppState>) { }

  get heightUnitName() {
    return ExtendedAppConfigService.objectModel.OtherText.HeightUnit;
  }

  get attributeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get rackMountableTypes() {
    return this.store.select(fromSelectAsset.selectRackMountableItemTypes);
  }

  get possibleAssets() {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfHeight(this.maxHeightUnits));
  }

  private get maxHeightUnits() {
    return this.maxFreeHeightUnit - this.heightUnit + 1;
  }

  ngOnInit(): void {
    if (!this.rack || this.heightUnit < 1 || this.maxFreeHeightUnit < 1 || this.minFreeHeightUnit < 1 ||
      this.maxFreeHeightUnit < this.minFreeHeightUnit || this.heightUnit > this.maxFreeHeightUnit ||
      this.heightUnit < this.minFreeHeightUnit) {
      throw new Error('illegel parameters');
    }
    for (let index = this.maxFreeHeightUnit; index >= this.minFreeHeightUnit; index--) {
      this.heightUnits.push(index);
    }
  }

  isAlsoSelectedByHeight(index: number) {
    if (!this.selectedModelId) {
      return of(false);
    }
    return this.store.select(fromSelectBasics.selectModel(this.selectedModelId)).pipe(
      map(model => index > this.heightUnit && index < this.heightUnit + model.heightUnits)
    );
  }

  getPossibleAssets(type: ItemType) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfTypeAndHeight(type.id, this.maxHeightUnits));
  }

  getPossibleModels(type: ItemType) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountableModelsForTypeAndHeight(type.id,this.maxHeightUnits ));
  }

  getAssetsForTypeAndModel(type: ItemType, model: Model) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfModelAndHeight(type.id, this.maxHeightUnits, model.id));
  }

  setHeightUnit(index: number) {
    if (index > this.maxFreeHeightUnit || index < this.minFreeHeightUnit) {
      throw new Error('illegal value ' + index);
    }
    this.heightUnit = index;
    this.selectedModelId = undefined;
    this.selectedTypeId = undefined;
  }

  mountRackMountable(rackMountable: RackMountable) {
    let heightUnits = ExtendedAppConfigService.objectModel.OtherText.HeightUnit + ':' + this.heightUnit;
    if (rackMountable.model.heightUnits > 1) {
        heightUnits = heightUnits.concat('-', (this.heightUnit + rackMountable.model.heightUnits - 1).toString());
    }
    this.mount.emit({
      heightUnits,
      rack: this.rack,
      rackMountable,
    });
  }

}
