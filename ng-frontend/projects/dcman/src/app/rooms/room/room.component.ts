import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { switchMap, withLatestFrom, skipWhile } from 'rxjs/operators';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as BasicsActions from '../../shared/store/basics/basics.actions';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { Rack } from '../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Room } from '../../shared/objects/asset/room.model';
import { EditFunctions } from 'backend-access';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  formOpen = false;
  private subscription: Subscription;
  private currentRoom: Room;


  constructor(private store: Store<fromApp.AppState>,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    this.subscription = this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.room),
    ).subscribe(([, room]) => {
      if (!room) {
        this.router.navigate(['/']);
      }
      this.currentRoom = room;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get ready() {
    return this.store.select(fromSelectAsset.ready);
  }

  get room() {
    return this.store.pipe(
      select(selectRouterStateId),
      switchMap(id => this.store.select(fromSelectBasics.selectRoom, id)),
    );
  }

  get racks() {
    return this.room.pipe(
      switchMap(room => this.store.select(fromSelectAsset.selectRacksInRoom, room))
    );
  }

  get names() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames;
  }

  getEnclosuresInRack(rack: Rack) {
    return this.store.select(fromSelectAsset.selectEnclosuresInRack, rack);
  }

  getServersInRack(rack: Rack) {
    return this.store.select(fromSelectAsset.selectServersInRack, rack);
  }

  onSubmit(room: Room) {
    this.formOpen = false;
    this.store.dispatch(BasicsActions.updateRoom({currentRoom: this.currentRoom, updatedRoom: room}));
  }

  onDelete() {
    this.formOpen = false;
    this.store.dispatch(BasicsActions.deleteRoom({roomId: this.currentRoom.id}));
    this.router.navigate(['/']);
  }

  takeResponsibility() {
    EditFunctions.takeResponsibility(this.http, this.currentRoom.id,
      BasicsActions.readRoom({roomId: this.currentRoom.id})).subscribe(action => this.store.dispatch(action));
  }

}
