import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';

import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { AppState } from '../../shared/store/app.reducer';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss']
})
export class AssetFormComponent implements OnInit {
  @Input() asset: Asset;
  @Output() submitted = new EventEmitter<AssetValue>();
  form: FormGroup;

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
    this.submitted.emit(this.form.value as AssetValue);
  }

  get models() {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemTypeByName, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack),
      switchMap(itemType => this.store.select(fromSelectBasics.selectModelsForItemType, itemType.id))
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
      ExtendedAppConfigService.statusCodes.Unused,
    ];
  }

}
