import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of, Observable, combineLatest } from 'rxjs';
import { switchMap, take, withLatestFrom, skipWhile, map } from 'rxjs/operators';

import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../shared/objects/asset/enclosure-mountable.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackContainer } from '../../shared/objects/position/rack-container.model';
import { EnclosureContainer } from '../../shared/objects/position/enclosure-container.model';

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.scss']
})
export class RackComponent implements OnInit {
  private containers$: RackContainer[] = [];
  private enclosureContainers$: EnclosureContainer[] = [];
  selectedRackMountable: RackMountable;
  selectedHeightUnit: number;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.rack, this.rackMountablesForRack$, this.enclosureMountablesForRack$),
      // take(1),
    ).subscribe(([, rack, rackMountables, enclosureMountables]) => {
      if (!rack) {
        this.router.navigate(['rooms']);
      }
      for (let index = 1; index < rack.heightUnits; index++) {
        const rackMountablesInSlot = rackMountables.filter(a => a.assetConnection.isInSlot(index));
        if (rackMountablesInSlot.length > 0) {
          this.createRackMountablesContainer(rackMountablesInSlot);
        }
      }
      rackMountables.forEach(rm => {
        if (rm instanceof BladeEnclosure) { // also containerize blade enclosure contents
          const encContainer = new EnclosureContainer(rm);
          this.enclosureContainers$.push(encContainer);
          enclosureMountables.servers.filter(m => m.connectionToEnclosure.containerItemId === rm.id).forEach(m => {
            let ec = encContainer.getContainerForPosition(m.slot);
            if (ec) {
              if (ec.width < m.width) { ec.width = m.width; }
              if (ec.height < m.height) { ec.height = m.height; }
              ec.mountables.push(m);
            } else {
              ec = { position: m.slot, width: m.width, height: m.height, mountables: [m] };
              encContainer.containers.push(ec);
            }
          });
        }
      });

    });
  }

  private createRackMountablesContainer(rackMountables: RackMountable[]) {
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

  get rackHeightUnits() {
    return this.rack.pipe(
      map(rack => rack ? Array(rack.heightUnits).fill(0).map((x, index: number) => rack.heightUnits - index) : of(null)),
    );
  }

  get names() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames;
  }

  get heightUnitName() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits;
  }

  private get rackMountablesForRack$() {
    return this.rack.pipe(
      switchMap(rack => this.store.select(fromSelectAsset.selectRackMountablesForRack, rack)),
    );
  }

  private get enclosureMountablesForRack$() {
    return this.rack.pipe(
      switchMap(rack => this.store.select(fromSelectAsset.selectEnclosuresInRack, rack)),
      switchMap(enclosures => {
        const servers: Observable<BladeServerHardware[]>[] = [];
        const mountables: Observable<EnclosureMountable[]>[] = [];
        enclosures.forEach(enc => {
          servers.push(this.store.select(fromSelectAsset.selectServersInEnclosure, enc));
          mountables.push(this.store.select(fromSelectAsset.selectNonServerMountablesInEnclosure, enc));
        });
        return combineLatest([combineLatest(servers), combineLatest(mountables)]);
      }),
      map(([serverArray, mountableArray]) => {
        return {
          servers: serverArray.reduce((accumulator, value) => accumulator.concat(value), []),
          mountables: mountableArray.reduce((accumulator, value) => accumulator.concat(value), []),
        };
      }),
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

  getEnclosureSlots(enclosure: BladeEnclosure) {
    return Array(enclosure.height * enclosure.width).fill(0).map((x, index: number) => index + 1);
  }

  getEnclosureSlotContent(enclosure: BladeEnclosure, slot: number) {
    return this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).getContainerForExactPosition(slot);
  }

  hasEnclosureSlotContent(enclosure: BladeEnclosure, slot: number) {
    return this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).hasContainerInPosition(slot);
  }

  getBladeServerHardwareInEnclosure(enc: BladeEnclosure) {
    return this.store.select(fromSelectAsset.selectServersInEnclosure, enc);
  }

  repeat(value: number) {
    if (!value || value < 1) { value = 1; }
    return 'repeat(' + value + ', 1fr)';
  }
}
