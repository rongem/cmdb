import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';

import { Rack } from '../../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { AppState } from '../../../shared/store/app.reducer';
import { RackValue } from '../../../shared/objects/form-values/rack-value.model';
import { AssetStatus } from '../../../shared/objects/asset/asset-status.enum';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styleUrls: ['./rack-form.component.scss']
})
export class RackFormComponent implements OnInit {
  @Input() rack: Rack;
  @Output() submitted = new EventEmitter<RackValue>();
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: this.rack.id,
      name: [this.rack.name, [Validators.required]],
      modelId: [this.rack.model ? this.rack.model.id : '', [Validators.required]],
      serialNumber: this.rack.serialNumber,
      status: [this.rack.status && this.rack.status !== AssetStatus.Unknown ? this.rack.status : undefined, [Validators.required]],
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

  get models() {
    return this.store.select(fromSelectBasics.selectModelsForItemType,
      ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack
    );
  }

  get statusCodes() {
    return [
      ExtendedAppConfigService.statusCodes.Booked,
      ExtendedAppConfigService.statusCodes.InProduction,
      ExtendedAppConfigService.statusCodes.Stored,
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
