import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from 'backend-access';

import { Room } from '../../shared/objects/asset/room.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
    selector: 'app-room-form',
    templateUrl: './room-form.component.html',
    styleUrls: ['./room-form.component.scss'],
    standalone: false
})
export class RoomFormComponent implements OnInit {
  @Input() room: Room;
  @Input() building: string;
  @Output() submitted = new EventEmitter<Room>();
  @Output() deleted = new EventEmitter();
  createMode = false;
  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private validator: ValidatorService) { }

  ngOnInit(): void {
    this.createMode = false;
    this.validator.setTypeByName(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room);
    if (this.room) {
      this.form = this.fb.group({
        id: this.room.id,
        name: [this.room.name, [Validators.required]],
        building: [this.room.building === '(n/a)' ? '' : this.room.building, [Validators.required]],
      });
    } else {
      this.createMode = true;
      this.form = this.fb.group({
        id: undefined,
        name: ['', [Validators.required]],
        building: [this.building, [Validators.required]],
      }, {asyncValidators: this.validator.validateNameAndType});
    }
  }

  get attributeTypeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  submit() {
    if (this.form.invalid) { return; }
    this.submitted.emit(this.form.value as Room);
  }

  delete() {
    this.deleted.emit();
  }
}
