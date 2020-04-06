import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { switchMap, take, withLatestFrom, skipWhile } from 'rxjs/operators';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { Rack } from '../../shared/objects/asset/rack.model';
import { AppConfigService } from '../../shared/app-config.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.room),
      take(1),
    ).subscribe(([, room]) => {
      if (!room) {
        this.router.navigate(['rooms']);
      }
    });
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
    return AppConfigService.objectModel.ConfigurationItemTypeNames;
  }

  getEnclosuresInRack(rack: Rack) {
    return this.store.select(fromSelectAsset.selectEnclosuresInRack, rack);
  }

  getServersInRack(rack: Rack) {
    return this.store.select(fromSelectAsset.selectServersInRack, rack);
  }

}
