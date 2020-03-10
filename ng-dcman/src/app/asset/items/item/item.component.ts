import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';
import { Mappings } from 'src/app/shared/objects/appsettings/mappings.model';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Guid } from 'src/app/shared/guid';

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
    this.subscription = this.item.subscribe(item => {
      if (!item) {
        return;
      }
      console.log(item);
      this.form = this.fb.group({
        name: this.fb.control(item.name, [Validators.required]),
        assetType: this.fb.control(item.assetType.name),
        serialNumber: this.fb.control(item.serialNumber),
        modelId: this.fb.control(item.model ? item.model.id : '', [Validators.required])
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
      switchMap((id: Guid) => this.store.select(fromSelectAsset.selectItem, id)),
    );
  }

  get userRole() {
    return this.store.select(fromSelectMetaData.selectUserRole);
  }

  get assetTypes() {
    return this.store.pipe(
      select(fromSelectMetaData.selectItemTypes),
      map(itemTypes => itemTypes.filter(it => 
        it.TypeName.toLocaleLowerCase() !== AppConfigService.objectModel.ConfigurationItemTypeNames.Room.toLocaleLowerCase()).map(
          it => ({id: it.TypeId, name: it.TypeName})
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
