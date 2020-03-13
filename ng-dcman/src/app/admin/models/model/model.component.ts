import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription, of } from 'rxjs';
import { map, withLatestFrom, skipWhile, take, switchMap } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState, selectRouterStateId } from 'src/app/shared/store/router/router.reducer';
import { Model } from 'src/app/shared/objects/model.model';
import { Guid } from 'src/app/shared/guid';
import { AppConfigService } from 'src/app/shared/app-config.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {
  form: FormGroup;
  createMode = false;
  private subscription: Subscription;
  itemTypeNames = Object.values(AppConfigService.objectModel.ConfigurationItemTypeNames).filter(n =>
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Model &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Room &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Server &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance
  );
  private lowerNames = this.itemTypeNames.map(n => n.toLocaleLowerCase());

  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.model),
      take(1),
    ).subscribe(([, model]) => {
      if (!model && !this.createMode) {
        this.router.navigate(['admin', 'models']);
      }
    });
    this.subscription = this.model.subscribe(model => {
      if (!model) {
        model = new Model();
        model.id = Guid.create();
      }
      this.form = this.fb.group({
        id: this.fb.control(model.id),
        name: this.fb.control(model.name, [Validators.required]),
        manufacturer: this.fb.control(model.manufacturer, [Validators.required]),
        targetType: this.fb.control(model.targetType, [Validators.required]),
        height: this.fb.control(model.height, [Validators.required]),
        heightUnits: this.fb.control(model.heightUnits),
        width: this.fb.control(model.width),
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get ready() {
    return this.store.select(fromSelectBasics.ready);
  }

  get model() {
    return this.store.pipe(
      select(selectRouterStateId),
      switchMap(id => this.store.select(fromSelectBasics.selectModel, id)),
    );
  }

}
