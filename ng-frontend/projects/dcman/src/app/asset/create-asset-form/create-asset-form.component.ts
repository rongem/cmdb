import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { AppState } from '../../shared/store/app.reducer';
import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { Model } from '../../shared/objects/model.model';

@Component({
  selector: 'app-create-asset-form',
  templateUrl: './create-asset-form.component.html',
  styleUrls: ['./create-asset-form.component.scss']
})
export class CreateAssetFormComponent implements OnInit {
  @Input() model: Model;
  @Output() submitted = new EventEmitter();
  @ViewChild('addSerialToName', {static: true}) addSerialToName: HTMLInputElement;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    if (!this.model) { throw new Error(('model must not be empty')); }
    this.form = this.fb.group({
      baseName: '',
      assets: this.fb.array([
        this.createItem(),
      ])
    });
  }

  get assets() {
    return (this.form.get('assets') as FormArray).controls;
  }

  private createItem() {
    return this.fb.group({
        name: ['', this.addSerialToName.checked ? [] : [Validators.required]],
        serialNumber: ['', [Validators.required]],
      });
  }

  setValidators() {
    const baseName = this.form.get('baseName');
    if (this.addSerialToName.checked) {
      baseName.setValidators(Validators.required);
      this.assets.forEach(asset => asset.get('name').clearValidators());
    } else {
      baseName.clearValidators();
      this.assets.forEach(asset => asset.get('name').setValidators(Validators.required));
    }
  }

  onAddItem() {
    (this.form.get('assets') as FormArray).push(this.createItem());
  }

  onSubmit() {
    console.log(this.form.value);
  }

}
