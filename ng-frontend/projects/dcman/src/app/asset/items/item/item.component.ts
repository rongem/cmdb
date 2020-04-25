import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../../shared/store/asset/asset.selectors';

import { AppState } from '../../../shared/store/app.reducer';
import { getRouterState } from '../../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { Guid } from 'backend-access';
import { Asset } from '../../../shared/objects/prototypes/asset.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {

  form: FormGroup;
  createMode = false;
  private subscription: Subscription;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subscription = this.item.pipe(withLatestFrom(this.route)).subscribe(([item, state]) => {
      if (state.params.id && Guid.isGuid(state.params.id) && (!item || item.id.toLowerCase() !== state.params.id.toLowerCase())) {
        return;
      }
      if (!item) {
        item = new Asset();
        item.id = Guid.create().toString();
        item.name = '';
        item.serialNumber = '';
      }
      this.form = this.fb.group({
        id: item.id,
        name: [item.name, [Validators.required]],
        assetType: item.assetType ? item.assetType.name : '',
        serialNumber: item.serialNumber,
        modelId: [item.model ? item.model.id : '', [Validators.required]],
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  get item() {
    return this.route.pipe(
      map(state => state.params.id),
      switchMap((id: string) => this.store.select(fromSelectAsset.selectItem, Guid.parse(id).toString())),
    );
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get assetTypes() {
    return this.store.pipe(
      select(MetaDataSelectors.selectItemTypes),
      map(itemTypes => itemTypes.filter(it =>
        it.name.toLocaleLowerCase() !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room.toLocaleLowerCase()).map(
          it => ({id: it.id, name: it.name})
        )),
    );
  }

  get models() {
    if (!this.form.value.assetType) {
      return of([]);
    }
    return this.store.select(fromSelectBasics.selectModelsForItemType, this.form.value.assetType);
  }

}
