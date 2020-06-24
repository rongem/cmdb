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
export class MountFormComponent implements OnInit {
  @Input() rack: Rack;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
  }

}
