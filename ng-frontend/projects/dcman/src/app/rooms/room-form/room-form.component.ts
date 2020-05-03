import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid, ItemType, EditFunctions } from 'backend-access';

import { Room } from '../../shared/objects/asset/room.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { noAction } from '../../shared/store/basics/basics.actions';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  @Input() room: Room;
  @Output() submitted = new EventEmitter<Room>();
  @Output() deleted = new EventEmitter();
  createMode = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.createMode = false;
    if (this.room) {
      this.form = this.fb.group({
        id: this.room.id,
        name: [this.room.name, [Validators.required]],
        building: [this.room.building, [Validators.required]],
      });
    } else {
      this.createMode = true;
      this.form = this.fb.group({
        id: Guid.create().toString(),
        name: ['', [Validators.required]],
        building: ['', [Validators.required]],
      });
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
