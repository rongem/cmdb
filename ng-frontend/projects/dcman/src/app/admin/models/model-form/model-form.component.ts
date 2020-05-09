import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ItemType, EditFunctions, ValidatorService } from 'backend-access';

import { Model } from '../../../shared/objects/model.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { Mappings } from '../../../shared/objects/appsettings/mappings.model';
import { noAction } from '../../../shared/store/basics/basics.actions';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss']
})
export class ModelFormComponent implements OnInit {
  @Input() model: Model;
  @Input() itemType: ItemType;
  @Output() submitted = new EventEmitter<Model>();
  @Output() deleted = new EventEmitter();
  createMode = false;

  itemTypeNames = Object.values(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames).filter(n =>
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Server &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance
  );

  form: FormGroup;

  constructor(private fb: FormBuilder, private validator: ValidatorService, private http: HttpClient) { }

  ngOnInit(): void {
    this.createMode = false;
    this.validator.setTypeByName(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model);
    if (!this.model) {
      if (!this.itemType) {
        // this should not occur
        return;
      } else {
        // new model for existing itemType
        this.createMode = true;
        this.model = new Model();
        this.model.id = Guid.create().toString();
        this.model.targetType = this.itemType.name.toLocaleLowerCase();
      }
    } else {
      if (this.model.item && this.model.item.userIsResponsible === false) {
        EditFunctions.takeResponsibility(this.http, this.model.id, noAction()).subscribe();
      }
    }
    this.form = this.fb.group({
      id: this.model.id,
      name: [this.model.name, [Validators.required]],
      manufacturer: [this.model.manufacturer, [Validators.required]],
      targetType: [this.model.targetType, [Validators.required]],
      height: this.model.height,
      heightUnits: this.model.heightUnits,
      width: this.model.width,
    }, {asyncValidators: this.createMode ? this.validator.validateNameAndType : []});
    this.setValidators(this.model.targetType);
  }

  onChange(event: string) {
    this.setValidators(event);
  }

  private setValidators(value: string) {
    const height = this.form.get('height');
    const width = this.form.get('width');
    const heightUnits = this.form.get('heightUnits');
    if (Mappings.rackMountables.includes(value)) {
      heightUnits.setValidators([Validators.required, Validators.min(1)]);
    } else {
      heightUnits.setValidators(null);
    }
    if (Mappings.enclosureMountables.includes(value)) {
      height.setValidators([Validators.required, Validators.min(1)]);
      width.setValidators([Validators.required, Validators.min(1)]);
    } else {
      height.setValidators(null);
      width.setValidators(null);
    }
    height.updateValueAndValidity();
    width.updateValueAndValidity();
    heightUnits.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted.emit(this.form.value as Model);
  }

  delete() {
    this.deleted.emit();
  }

}
