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
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';

@Component({
  selector: 'app-enclosure',
  templateUrl: './enclosure.component.html',
  styleUrls: ['./enclosure.component.scss']
})
export class EnclosureComponent implements OnInit {
  selectedEnclosure: BladeEnclosure;

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  ngOnInit() {
  }

  get enclosureName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure;
  }

  get modelName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model;
  }

  get models() {
    return this.store.select(fromSelectBasics.selectModelsForItemType, this.enclosureName);
  }

  get enclosuresWithoutModel() {
    return this.store.select(fromSelectAsset.selectEnclosuresWithoutModel);
  }

  getEnclosuresForModel(model: Model) {
    return this.store.select(fromSelectAsset.selectEnclosuresForModel, model);
  }

  getRack(rackId: string) {
    return this.store.select(fromSelectAsset.selectRack, rackId);
  }

  onSubmit(updatedEnclosure: AssetValue) {
    this.store.dispatch(AssetActions.updateEnclosure({currentEnclosure: this.selectedEnclosure, updatedEnclosure}));
    this.selectedEnclosure = undefined;
  }

  selectEnclosure(enclosure: BladeEnclosure) {
    if (enclosure.item.userIsResponsible) {
      this.selectedEnclosure = enclosure;
    } else {
      EditFunctions.takeResponsibility(this.http, enclosure.id, AssetActions.readEnclosure({enclosureId: enclosure.id})).subscribe(action =>
        this.store.dispatch(action)
      );
    }
  }
}
