import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ItemType, EditFunctions, ValidatorService, MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';

import { Rack } from '../../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { AppState } from '../../../shared/store/app.reducer';
import { switchMap } from 'rxjs/operators';
import { AssetStatus } from '../../../shared/objects/asset/asset-status.enum';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styleUrls: ['./rack-form.component.scss']
})
export class RackFormComponent implements OnInit {
  @Input() rack: Rack;
  @Output() submitted = new EventEmitter<Rack>();
  @Output() deleted = new EventEmitter();

  constructor(private fb: FormBuilder,
              private validator: ValidatorService,
              private http: HttpClient,
              private store: Store<AppState>) { }

  form: FormGroup;

  ngOnInit(): void {
    console.log(ExtendedAppConfigService.statusCodes);
    this.form = this.fb.group({
      id: this.rack.id,
      name: [this.rack.name, [Validators.required]],
      model: [this.rack.model ? this.rack.model.id : '', [Validators.required]],
      serialNumber: this.rack.serialNumber,
      status: this.rack.status,
      maxHeight: [this.rack.maxHeight, [Validators.min(1), Validators.max(100)]],
      room: [this.rack.connectionToRoom ? this.rack.connectionToRoom.roomId : '', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted.emit(this.form.value as Rack);
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

}
