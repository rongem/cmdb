import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as AssetActions from '../../shared/store/asset/asset.actions';

import { Rack } from '../../shared/objects/asset/rack.model';
import { ItemType } from 'dist/backend-access/public-api';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { map } from 'rxjs/operators';
import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';

@Component({
  selector: 'app-rack-mount-form',
  templateUrl: './rack-mount-form.component.html',
  styleUrls: ['./rack-mount-form.component.scss']
})
export class RackMountFormComponent implements OnInit {
  @Input() rack: Rack;
  @Input() heightUnit: number;
  @Input() maxFreeHeightUnit: number;
  @Input() minFreeHeightUnit: number;
  @Output() mount = new EventEmitter<{heightUnits: string, rack: Rack, rackMountable: RackMountable}>();
  heightUnits: number[] = [];
  selectedTypeId: string;
  selectedModelId: string;

  constructor(private store: Store<fromApp.AppState>) { }

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

  private get maxHeightUnits() {
    return this.maxFreeHeightUnit - this.heightUnit + 1;
  }

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
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfHeight, this.maxHeightUnits);
  }

  isAlsoSelectedByHeight(index: number) {
    if (!this.selectedModelId) {
      return of(false);
    }
    return this.store.select(fromSelectBasics.selectModel, this.selectedModelId).pipe(
      map(model => index > this.heightUnit && index < this.heightUnit + model.heightUnits)
    );
  }

  getPossibleAssets(type: ItemType) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfTypeAndHeight,
      {typeId: type.id, maxHeightUnits: this.maxHeightUnits}
    );
  }

  getPossibleModels(type: ItemType) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountableModelsForTypeAndHeight,
      {typeId: type.id, maxHeightUnits: this.maxHeightUnits}
    );
  }

  getAssetsForTypeAndModel(type: ItemType, model: Model) {
    return this.store.select(fromSelectAsset.selectUnmountedRackMountablesOfModelAndHeight,
      {typeId: type.id, maxHeightUnits: this.maxHeightUnits, modelId: model.id}
    );
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
