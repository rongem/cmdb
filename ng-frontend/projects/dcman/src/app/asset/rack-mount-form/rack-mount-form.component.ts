import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectProv from '../../shared/store/provisionable/provisionable.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { Rack } from '../../shared/objects/asset/rack.model';

@Component({
  selector: 'app-rack-mount-form',
  templateUrl: './rack-mount-form.component.html',
  styleUrls: ['./rack-mount-form.component.scss']
})
export class RackMountFormComponent implements OnInit {
  @Input() rack: Rack;
  @Input() heightUnit: number;
  @Input() maxFreeHeightUnit: number;
  @Input() minFreeHeightUnit: number;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    if (!this.rack || this.heightUnit < 1 || this.maxFreeHeightUnit < 1 || this.minFreeHeightUnit < 1 ||
      this.maxFreeHeightUnit < this.minFreeHeightUnit || this.heightUnit > this.maxFreeHeightUnit ||
      this.heightUnit < this.minFreeHeightUnit) {
      throw new Error('illegel parameters');
    }
  }

}
