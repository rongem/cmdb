import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { switchMap, take, withLatestFrom, skipWhile, map } from 'rxjs/operators';

import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { Rack } from '../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.scss']
})
export class RackComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.rack),
      take(1),
    ).subscribe(([, rack]) => {
      if (!rack) {
        this.router.navigate(['rooms']);
      }
    });
  }

  get ready() {
    return this.store.select(fromSelectAsset.ready);
  }

  get rack() {
    return this.store.pipe(
      select(selectRouterStateId),
      switchMap(id => this.store.select(fromSelectAsset.selectRack, id)),
    );
  }

  get rackSlots() {
    return this.rack.pipe(
      map(rack => rack ? Array(rack.maxHeight).fill(0).map((x, index: number) => rack.maxHeight - index) : null),
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

}
