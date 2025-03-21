import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { MetaDataSelectors, EditFunctions } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as AssetActions from '../../shared/store/asset/asset.actions';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { Rack } from '../../shared/objects/asset/rack.model';
import { RackValue } from '../../shared/objects/form-values/rack-value.model';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { llc } from '../../shared/store/functions';

@Component({
    selector: 'app-racks',
    templateUrl: './racks.component.html',
    styleUrls: ['./racks.component.scss'],
    standalone: false
})
export class RacksComponent implements OnInit {
  selectedRack: Rack;
  selectedModel: Model;

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  get rackName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack;
  }

  get modelName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model;
  }

  get rackType() {
    return this.store.select(MetaDataSelectors.selectSingleItemTypeByName(this.rackName));
  }

  get models() {
    return this.rackType.pipe(switchMap(type => this.store.select(fromSelectBasics.selectModelsForItemType(type.id))));
  }

  get racksWithoutModel() {
    return this.store.select(fromSelectAsset.selectRacksWithoutModel);
  }

  get existingRackNames() {
    return this.store.select(fromSelectAsset.selectRacks).pipe(map(racks => racks.map(rack => llc(rack.name))));
  }

  ngOnInit(): void {
  }

  getRacksForModel(model: Model) {
    return this.store.select(fromSelectAsset.selectRacksForModel(model));
  }

  getRoom(roomId: string) {
    return this.store.select(fromSelectBasics.selectRoom(roomId));
  }

  onSubmitUpdate(updatedRack: RackValue) {
    this.store.dispatch(AssetActions.updateRack({currentRack: this.selectedRack, updatedRack}));
    this.selectedRack = undefined;
  }

  onSubmitCreated(assets: AssetValue[]) {
    assets.forEach(asset => this.store.dispatch(AssetActions.createAsset({asset})));
    this.selectedModel = undefined;
  }

  selectRack(rack: Rack) {
    if (rack.item.userIsResponsible) {
      this.selectedRack = rack;
    } else {
      EditFunctions.takeResponsibility(this.http, this.store, rack.id).subscribe(() =>
        this.store.dispatch(AssetActions.readRack({rackId: rack.id}))
      );
    }
  }

}
