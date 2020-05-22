import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Guid } from 'backend-access';

import { AssetValue } from '../../shared/objects/form-values/asset-value.model';
import { Model } from '../../shared/objects/model.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-create-asset-form',
  templateUrl: './create-asset-form.component.html',
  styleUrls: ['./create-asset-form.component.scss']
})
export class CreateAssetFormComponent implements OnInit {
  @Input() model: Model;
  @Input() existingNames: string[];
  @Output() submitted = new EventEmitter<AssetValue[]>();
  @ViewChild('addSerialToName', {static: true}) addSerialToName: ElementRef;
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.model) { throw new Error('model must not be empty'); }
    if (!this.existingNames) { throw new Error('existingNames must not be empty'); }
    this.form = this.fb.group({
      baseName: '',
      assets: this.fb.array([
        this.createItem(),
      ], { validators: [this.validateSerialsAndNames]})
    });
  }

  get assets() {
    return (this.form.get('assets') as FormArray).controls;
  }

  get modelName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model;
  }

  private createItem() {
    return this.fb.group({
        name: ['', this.addSerialToName.nativeElement.checked ? [] : [Validators.required]],
        serialNumber: ['', [Validators.required]],
      });
  }

  setValidators() {
    const baseName = this.form.get('baseName');
    if (this.addSerialToName.nativeElement.checked) {
      baseName.setValidators(Validators.required);
      this.assets.forEach(asset => asset.get('name').clearValidators());
    } else {
      baseName.clearValidators();
      this.assets.forEach(asset => asset.get('name').setValidators([Validators.required]));
    }
    baseName.updateValueAndValidity();
    this.assets.forEach(asset => asset.get('name').updateValueAndValidity());
  }

  validateSerialsAndNames = (assets: FormArray) => {
    const serials: string[] = [...new Set(assets.controls.map(asset => asset.value.serialNumber.toLocaleLowerCase()))];
    if (assets.controls.length !== serials.length) {
      return {error: 'duplicate serial number'};
    }
    if (this.addSerialToName.nativeElement?.checked === false) {
      const names: string[] = [...new Set(assets.controls.map(asset => asset.value.name))];
      if (assets.controls.length !== names.length) {
        return {error: 'duplicate name'};
      }
      if (names.some(name => this.existingNames.includes(name))) {
        return {error: 'name already exists'};
      }
    } else {
      const names: string[] = serials.map(serial => this.form.value.baseName.toLocaleLowerCase() + ' ' + serial.toLocaleLowerCase());
      if (names.some(name => this.existingNames.includes(name))) {
        return {error: 'name already exists'};
      }
    }
    return null;
  }

  onAddItem() {
    (this.form.get('assets') as FormArray).push(this.createItem());
  }

  onDeleteItem(index: number) {
    const assets = this.form.get('assets') as FormArray;
    assets.removeAt(index);
    if (this.addSerialToName.nativeElement.checked && assets.length < 2) {
      assets.get('0').get('name').setValue(this.form.value.baseName);
      this.addSerialToName.nativeElement.checked = false;
      this.setValidators();
    }
  }

  onSubmit() {
    if (!this.form.valid) { return; }
    const assets: AssetValue[] = [];
    this.form.value.assets.forEach(asset => assets.push({
      id: Guid.create().toString(),
      model: this.model,
      name: this.addSerialToName.nativeElement.checked ? this.form.value.baseName + ' ' + asset.serialNumber : asset.name,
      serialNumber: asset.serialNumber,
      status: AssetStatus.Stored,
    }));
    this.submitted.emit(assets);
  }

}
