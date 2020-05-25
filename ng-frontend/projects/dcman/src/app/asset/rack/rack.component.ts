import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take, withLatestFrom, skipWhile, map } from 'rxjs/operators';

import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { Rack } from '../../shared/objects/asset/rack.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../shared/objects/asset/enclosure-mountable.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.scss']
})
export class RackComponent implements OnInit {
  private containers$: {minSlot: number, maxSlot: number, rackMountables: RackMountable[]}[] = [];

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.rack, this.assetsForRack),
      take(1),
    ).subscribe(([, rack, assets]) => {
      if (!rack) {
        this.router.navigate(['rooms']);
      }
      for (let index = 1; index < rack.heightUnits; index++) {
        const rackMountables = assets.filter(a => a.assetConnection.isInSlot(index));
        if (rackMountables.length > 0) {
          let minSlot = rackMountables[0].assetConnection.minSlot;
          let maxSlot = rackMountables[0].assetConnection.maxSlot;
          if (rackMountables.length > 1) {
            rackMountables.forEach(rm => {
              if (rm.assetConnection.minSlot < minSlot) {
                minSlot = rm.assetConnection.minSlot;
              }
              if (rm.assetConnection.maxSlot > maxSlot) {
                maxSlot = rm.assetConnection.maxSlot;
              }
            });
          }
          // since it is possible to have more than one item in a special height unit, container objects
          // will keep them in shape in html
          let container = this.containers$.find(c => (c.maxSlot <= maxSlot && c.maxSlot >= minSlot) ||
            (c.minSlot <= maxSlot && c.minSlot >= minSlot));
          if (!container) {
            container = { minSlot, maxSlot, rackMountables, };
            this.containers$.push(container);
          }
          if (container.minSlot > minSlot) {
            container.minSlot = minSlot;
          }
          if (container.maxSlot < maxSlot) {
            container.maxSlot = maxSlot;
          }
          rackMountables.forEach(rm => {
            if (!container.rackMountables.includes(rm)) {
              container.rackMountables.push(rm);
            }
          });
        }
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

  get room() {
    return this.rack.pipe(
      switchMap(rack => !!rack && !!rack.connectionToRoom ?
        this.store.select(fromSelectBasics.selectRoom, rack.connectionToRoom.roomId) : of(null)),
    );
  }

  get rackSlots() {
    return this.rack.pipe(
      map(rack => rack ? Array(rack.heightUnits).fill(0).map((x, index: number) => rack.heightUnits - index) : of(null)),
    );
  }

  get names() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames;
  }

  get assetsForRack() {
    return this.rack.pipe(
      switchMap(rack => this.store.select(fromSelectAsset.selectRackMountablesForRack, rack)),
    );
  }

  getContainer(index: number) {
    return this.containers$.find(c => c.maxSlot === index);
  }

  getContainerHeight(index: number) {
    const container = this.containers$.find(c => c.maxSlot === index);
    if (container) {
      return container.maxSlot - container.minSlot + 1;
    }
    return 1;
  }

  getIsSlotFilled(index: number) {
    return !!this.containers$.find(c => c.minSlot <= index && c.maxSlot >= index);
  }

  getVerticalAssetSize(slot: number, rackMountableIndex: number) {
    const container = this.getContainer(slot);
    const rm = container.rackMountables[rackMountableIndex];
    const size = (1 + rm.assetConnection.maxSlot - rm.assetConnection.minSlot);
    const position = 1 + container.maxSlot - rm.assetConnection.maxSlot;
    return `${position} / span ${size}`;
  }

  getProvisionedSystem(m: RackMountable | EnclosureMountable) {
    if (m instanceof RackServerHardware || m instanceof BladeServerHardware) {
      return m.provisionedSystem;
    }
    return null;
  }

  getBladeEnclosure(m: RackMountable) {
    if (m instanceof BladeEnclosure) {
      return m as BladeEnclosure;
    }
    return null;
  }
}
