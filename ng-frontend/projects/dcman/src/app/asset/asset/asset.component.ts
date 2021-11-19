import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, withLatestFrom } from 'rxjs';
import { ItemType, MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as AssetActions from '../../shared/store/asset/asset.actions';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Model } from '../../shared/objects/model.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { llcc } from '../../shared/store/functions';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit, OnDestroy {
  selectedAsset: Asset;
  selectedModel: Model;
  currentItemType: ItemType;
  private subscription: Subscription;

  constructor(private store: Store<AppState>, private router: Router) { }
  get assetTypeName() {
    return this.currentItemType?.name;
  }

  get modelName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model;
  }

  get models() {
    return this.store.select(fromSelectBasics.selectModelsForItemType(this.assetTypeName));
  }

  get assetsWithoutModel() {
    return this.store.select(fromSelectAsset.selectAssetsWithoutModelForItemType(this.currentItemType?.id));
  }

  get existingAssetNames() {
    return this.store.select(fromSelectAsset.selectAssetNamesForType(this.currentItemType?.id));
  }

  ngOnInit(): void {
    this.subscription = this.store.select(selectRouterStateId).pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectItemTypes)),
    ).subscribe(([id, itemTypes]) => {
      if (!!id) {
        this.currentItemType = itemTypes.find(i => i.id === id);
        if (!this.currentItemType || llcc(this.currentItemType.name,
          ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model)) {
          this.router.navigate(['asset']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getAssetsForModel(model: Model) {
    return this.store.select(fromSelectAsset.selectAssetsForModel(model));
  }

  onSubmitUpdated(updatedAsset: AssetValue) {
    this.store.dispatch(AssetActions.updateAsset({currentAsset: this.selectedAsset, updatedAsset}));
    this.selectedAsset = undefined;
  }

  onSubmitCreated(assets: AssetValue[]) {
    assets.forEach(asset => this.store.dispatch(AssetActions.createAsset({asset})));
    this.selectedModel = undefined;
  }

  selectAsset(asset: Asset) {
    if (asset.item.userIsResponsible) {
      this.selectedAsset = asset;
    } else {
      if (!asset.model) {
        // if no model is present, we have to add a litte information the write protected asset
        const newAsset = {
          ...asset,
          model: {
            targetType: this.assetTypeName,
            item: { typeId: this.currentItemType.id, }
          },
        };
        asset = newAsset as Asset;
      }
      this.store.dispatch(AssetActions.takeAssetResponsibility({asset}));
    }
  }
}
