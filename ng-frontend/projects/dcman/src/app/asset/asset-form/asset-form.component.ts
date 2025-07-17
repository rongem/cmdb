import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';

import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { AppState } from '../../shared/store/app.reducer';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { Model } from '../../shared/objects/model.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';

@Component({
    selector: 'app-asset-form',
    templateUrl: './asset-form.component.html',
    styleUrls: ['./asset-form.component.scss'],
    standalone: false
})
export class AssetFormComponent implements OnInit {
  @Input({required: true}) asset: Asset;
  @Output() submitted = new EventEmitter<AssetValue>();
  form: UntypedFormGroup;
  private models$: Model[];

  constructor(private fb: UntypedFormBuilder,
              private store: Store<AppState>) { }

  get models() {
    return this.store.select(fromSelectBasics.selectModelsForItemType(this.asset.type)).pipe(
      tap(models => this.models$ = models),
    );
  }

  get attributeTypeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get configurationItemTypeNames() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames;
  }

  get statusCodes() {
    return [
      ExtendedAppConfigService.statusCodes.Booked,
      ExtendedAppConfigService.statusCodes.InProduction,
      ExtendedAppConfigService.statusCodes.Stored,
      ExtendedAppConfigService.statusCodes.Unused,
    ];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: this.asset.id,
      name: [this.asset.name, [Validators.required]],
      modelId: [this.asset.model ? this.asset.model.id : '', [Validators.required]],
      serialNumber: this.asset.serialNumber,
      status: [this.asset.status, [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const assetValue: AssetValue = {
      id: this.form.value.id,
      name: this.form.value.name,
      serialNumber: this.form.value.serialNumber,
      status: +this.form.value.status as AssetStatus,
      model: this.asset.model ?? this.models$.find(m => m.id === this.form.value.modelId),
    };
    this.submitted.emit(assetValue);
  }

}
