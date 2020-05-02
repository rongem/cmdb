import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ItemType, EditFunctions } from 'backend-access';

import { Model } from '../../../shared/objects/model.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { Mappings } from '../../../shared/objects/appsettings/mappings.model';
import { HttpClient } from '@angular/common/http';
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

  itemTypeNames = Object.values(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames).filter(n =>
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Server &&
    n !== ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance
  );
  private lowerRackMountableNames = Mappings.rackMountables.map(rm => rm.toLocaleLowerCase());
  private lowerEnclosureMountableNames = Mappings.enclosureMountables.map(rm => rm.toLocaleLowerCase());

  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    if (!this.model) {
      if (!this.itemType) {
        // this should not occur
        return;
      } else {
        // new model for existing itemType
        this.model = new Model();
        this.model.id = Guid.create().toString();
        this.model.targetType = this.itemType.name.toLocaleLowerCase();
      }
    } else {
      if (this.model.item && this.model.item.userIsResponsible === false) {
        EditFunctions.takeResponsibility(this.http, this.model.id, noAction()).subscribe();
      }
      if (!this.itemType) {
        // model without itemtype, must be solved
      } else {
        // edit existing valid model
      }
    }
    this.form = this.fb.group({
      id: this.fb.control(this.model.id),
      name: this.fb.control(this.model.name, [Validators.required]),
      manufacturer: this.fb.control(this.model.manufacturer, [Validators.required]),
      targetType: this.fb.control(this.model.targetType, [Validators.required]),
      height: this.fb.control(this.model.height),
      heightUnits: this.fb.control(this.model.heightUnits),
      width: this.fb.control(this.model.width),
    });
    this.setValidators(this.model.targetType);
  }

  onChange(event: string) {
    this.setValidators(event);
  }

  private setValidators(value: string) {
    const height = this.form.get('height');
    const width = this.form.get('width');
    const heightUnits = this.form.get('heightUnits');
    if (this.lowerRackMountableNames.includes(value)) {
      heightUnits.setValidators([Validators.required, Validators.min(1)]);
    } else {
      heightUnits.setValidators(null);
    }
    if (this.lowerEnclosureMountableNames.includes(value)) {
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
