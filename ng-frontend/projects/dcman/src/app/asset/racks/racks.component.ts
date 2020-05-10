import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { Rack } from '../../shared/objects/asset/rack.model';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss']
})
export class RacksComponent implements OnInit {
  selectedRack: Rack;

  constructor(private store: Store<AppState>) { }

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

}
