import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectBasics from '../shared/store/basics/basics.selectors';
import * as BasicsActions from '../shared/store/basics/basics.actions';
import * as fromSelectAsset from '../shared/store/asset/asset.selectors';

import { AppState } from '../shared/store/app.reducer';

import { Room } from '../shared/objects/asset/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  currentBuilding = '';

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  get buildings() {
    return this.store.select(fromSelectBasics.selectBuildings);
  }

  getRoomsByBuilding(buidling: string) {
    return this.store.select(fromSelectBasics.selectRoomsByBuilding, buidling);
  }

  getRacksInRoom(room: Room) {
    return this.store.select(fromSelectAsset.selectRacksInRoom, room);
  }

  onCreateRoom(room: Room) {
    this.currentBuilding = '';
    this.store.dispatch(BasicsActions.createRoom({room}));
  }

}
