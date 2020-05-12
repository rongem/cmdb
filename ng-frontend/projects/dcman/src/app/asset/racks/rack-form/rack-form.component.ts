import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';

import { Rack } from '../../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { AppState } from '../../../shared/store/app.reducer';
import { switchMap } from 'rxjs/operators';
import { RackValue } from '../../../shared/objects/form-values/rack-value.model';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styleUrls: ['./rack-form.component.scss']
})
export class RackFormComponent implements OnInit {
  @Input() rack: Rack;
  @Output() submitted = new EventEmitter<RackValue>();
  @Output() deleted = new EventEmitter();

  constructor(private fb: FormBuilder,
              private store: Store<AppState>) { }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: this.rack.id,
      name: [this.rack.name, [Validators.required]],
      modelId: [this.rack.model ? this.rack.model.id : '', [Validators.required]],
      serialNumber: this.rack.serialNumber,
      status: [this.rack.status, [Validators.required]],
      heightUnits: [this.rack.heightUnits, [Validators.min(1), Validators.max(100)]],
      roomId: [this.rack.connectionToRoom ? this.rack.connectionToRoom.roomId : '', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted.emit(this.form.value as RackValue);
  }

  delete() {
    this.deleted.emit();
  }

  get models() {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemTypeByName, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack),
      switchMap(itemType => this.store.select(fromSelectBasics.selectModelsForItemType, itemType.id))
    );
  }

  get statusCodes() {
    return [
      ExtendedAppConfigService.statusCodes.Booked,
      ExtendedAppConfigService.statusCodes.InProduction,
      ExtendedAppConfigService.statusCodes.Unused,
    ];
  }

  get rooms() {
    return this.store.select(fromSelectBasics.selectRooms);
  }

  get attributeTypeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get configurationItemTypeNames() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames;
  }

}
