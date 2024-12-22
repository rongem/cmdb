import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectBasics from '../shared/store/basics/basics.selectors';
import * as BasicsActions from '../shared/store/basics/basics.actions';
import * as fromSelectAsset from '../shared/store/asset/asset.selectors';

import { AppState } from '../shared/store/app.reducer';

import { Room } from '../shared/objects/asset/room.model';
import { Rack } from '../shared/objects/asset/rack.model';
import { of } from 'rxjs';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.scss'],
    standalone: false
})
export class RoomsComponent implements OnInit {
  currentBuilding = '';

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  get buildings() {
    return this.store.select(fromSelectBasics.selectBuildings);
  }

  getRoomsByBuilding(building: string) {
    return !!building ? this.store.select(fromSelectBasics.selectRoomsByBuilding(building)) : of([] as Room[]);
  }

  getRacksInRoom(room: Room) {
    return this.store.select(fromSelectAsset.selectRacksInRoom(room));
  }

  onCreateRoom(room: Room) {
    this.currentBuilding = '';
    this.store.dispatch(BasicsActions.createRoom({room}));
  }

}
