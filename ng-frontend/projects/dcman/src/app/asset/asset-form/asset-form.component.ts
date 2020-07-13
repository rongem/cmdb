import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

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
  styleUrls: ['./asset-form.component.scss']
})
export class AssetFormComponent implements OnInit {
  @Input() asset: Asset;
  @Output() submitted = new EventEmitter<AssetValue>();
  form: FormGroup;
  private models$: Model[];

  constructor(private fb: FormBuilder,
              private store: Store<AppState>) { }

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

  get models() {
    return this.store.pipe(
      select(fromSelectBasics.selectModelsForItemType, this.asset.type),
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

}
