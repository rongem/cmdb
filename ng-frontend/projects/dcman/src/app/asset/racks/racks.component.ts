import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, EditFunctions } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as AssetActions from '../../shared/store/asset/asset.actions';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { Rack } from '../../shared/objects/asset/rack.model';
import { RackValue } from '../../shared/objects/form-values/rack-value.model';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss']
})
export class RacksComponent implements OnInit {
  selectedRack: Rack;

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  ngOnInit(): void {
  }

  get rackName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack;
  }

  get rackType() {
    return this.store.select(MetaDataSelectors.selectSingleItemTypeByName, this.rackName);
  }

  get models() {
    return this.store.select(fromSelectBasics.selectModelsForItemType, this.rackName);
  }

  get racksWithoutModel() {
    return this.store.select(fromSelectAsset.selectRacksWithoutModel);
  }

  getRacksForModel(model: Model) {
    return this.store.select(fromSelectAsset.selectRacksForModel, model);
  }

  getRoom(roomId: string) {
    return this.store.select(fromSelectBasics.selectRoom, roomId);
  }

  onSubmit(updatedRack: RackValue) {
    this.store.dispatch(AssetActions.updateRack({currentRack: this.selectedRack, updatedRack}));
    this.selectedRack = undefined;
  }

  selectRack(rack: Rack) {
    if (rack.item.userIsResponsible) {
      this.selectedRack = rack;
    } else {
      EditFunctions.takeResponsibility(this.http, rack.id, AssetActions.readRack({rackId: rack.id})).subscribe(action =>
        this.store.dispatch(action)
      );
    }
  }

}
