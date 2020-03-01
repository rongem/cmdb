import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import { AppState } from 'src/app/shared/store/app.reducer';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  get buildings() {
    return this.store.select(fromSelectBasics.selectBuildings);
  }

  getRoomsByBuilding(buidling: string) {
    return this.store.select(fromSelectBasics.selectRoomsByBuilding, buidling);
  }

}
