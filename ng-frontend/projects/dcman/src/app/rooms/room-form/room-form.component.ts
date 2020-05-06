import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ValidatorService } from 'backend-access';

import { Room } from '../../shared/objects/asset/room.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  @Input() room: Room;
  @Input() building: string;
  @Output() submitted = new EventEmitter<Room>();
  @Output() deleted = new EventEmitter();
  createMode = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private validator: ValidatorService) { }

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
        id: Guid.create().toString(),
        name: ['', [Validators.required]],
        building: [this.building, [Validators.required]],
      }, {asyncValidators: this.validator.validateNameAndType});
    }
  }

  submit() {
    if (this.form.invalid) { return; }
    this.submitted.emit(this.form.value as Room);
  }

  delete() {
    this.deleted.emit();
  }
}
