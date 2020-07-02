import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { switchMap, skipWhile, map, withLatestFrom } from 'rxjs/operators';

import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromApp from '../../shared/store/app.reducer';
import * as AssetActions from '../../shared/store/asset/asset.actions';
import * as ProvisionableActions from '../../shared/store/provisionable/provisionable.actions';

import { selectRouterStateId } from '../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../shared/objects/asset/enclosure-mountable.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackContainer } from '../../shared/objects/position/rack-container.model';
import { EnclosureContainer } from '../../shared/objects/position/enclosure-container.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { AssetValue, createAssetValue } from '../../shared/objects/form-values/asset-value.model';
import { ProvisionedSystem } from '../../shared/objects/asset/provisioned-system.model';
import { Rack } from '../../shared/objects/asset/rack.model';
import { getRouterState } from 'projects/cmdb/src/app/shared/store/router/router.reducer';

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.scss']
})
export class RackComponent implements OnInit, OnDestroy {
  private containers$: RackContainer[] = [];
  private enclosureContainers$: EnclosureContainer[] = [];
  selectedRackMountable: RackMountable;
  selectedEnclosureMountable: EnclosureMountable;
  selectedHeightUnit: number;
  selectedEnclosureContainer: EnclosureContainer;
  selectedEnclosureSlot: number;
  showEnclosureBacksideId: string;
  enhancedAssetId: string;
  private maxHeightUnit: number;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.subscription = this.completeRack$.pipe(
      skipWhile(r => !r.ready),
      withLatestFrom(this.store.select(getRouterState)),
    ).subscribe(([result, routerState]) => {
      if (!routerState.state.url.startsWith('/asset/rack')) {
        return;
      }
      if (!result.rack) {
        this.router.navigate(['/']);
        return;
      }
      this.maxHeightUnit = result.rack.heightUnits;
      this.containers$ = [];
      this.enhancedAssetId = routerState.state.fragment;
      this.enclosureContainers$ = [];
      for (let index = 1; index < result.rack.heightUnits; index++) {
        const rackMountablesInSlot = result.rackMountables.filter(a =>
          a.assetConnection.isInSlot(index)).concat(result.enclosures.filter(e =>
          e.assetConnection.isInSlot(index)));
        if (rackMountablesInSlot.length > 0) {
          this.createRackMountablesContainer(rackMountablesInSlot);
        }
      }
      result.enclosures.forEach(enc => {
          const encContainer = new EnclosureContainer(enc);
          this.enclosureContainers$.push(encContainer);
          result.enclosureFrontSideMountables.filter(m => m.connectionToEnclosure.containerItemId === enc.id).forEach(m => {
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
          result.enclosureBackSideMountables.filter(m => m.connectionToEnclosure.containerItemId === enc.id).forEach(m => {
            this.ensureEnclosureBackSideMountableStatus(encContainer.enclosure, m);
            let ec = encContainer.backSideContainers.find(c => c.position === m.connectionToEnclosure.minSlot);
            if (ec) {
              ec.mountables.push(m);
            } else {
              ec = {position: m.connectionToEnclosure.minSlot, mountables: [m]};
              encContainer.backSideContainers.push(ec);
            }
          });
      });

    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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

  private get completeRack$() {
    return this.store.pipe(
      select(selectRouterStateId),
      switchMap(id => this.store.select(fromSelectAsset.selectCompleteRack, id)),
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

  get roomName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room;
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

  getSlotUpperFreeBoundary(index: number) {
    const value = Math.min(...this.containers$.map(c => c.minSlot).filter(s => s > index)) - 1;
    return isNaN(value) || value < 1 || value > this.maxHeightUnit ? this.maxHeightUnit : value;
  }

  getSlotLowerFreeBoundary(index: number) {
    const value = Math.max(...this.containers$.map(c => c.maxSlot).filter(s => s < index)) + 1;
    return value > 0 ? value : 1;
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
    return this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).hasContainerInExactPosition(slot);
  }

  hasAnyEnclosureSlotContent(enclosure: BladeEnclosure, slot: number) {
    return this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).hasContainerInPosition(slot);
  }

  getEnclosureBacksideSlots(enclosure: BladeEnclosure) {
    return this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).backSideSlots;
  }

  getEnclosureBacksideSlotContent(enclosure: BladeEnclosure, slot: number) {
    const co = this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id).backSideContainers.find(c => c.position === slot);
    return co ? co.mountables : [];
  }

  hasEnclosureBacksideSlotContent(enclosure: BladeEnclosure, slot: number) {
    return this.getEnclosureBacksideSlotContent(enclosure, slot).length > 0;
  }

  getBladeServerHardwareInEnclosure(enc: BladeEnclosure) {
    return this.store.select(fromSelectAsset.selectServersInEnclosure, enc);
  }

  repeat(value: number, minWidth?: string) {
    if (!value || value < 1) { value = 1; }
    return 'repeat(' + value + ', ' + (minWidth ? 'minmax(' + minWidth + ', 1fr)' : '1fr') + ')';
  }

  changedRackMountableStatus(status: AssetStatus) {
    this.store.dispatch(AssetActions.updateAsset({
      currentAsset: this.selectedRackMountable,
      updatedAsset: createAssetValue(this.selectedRackMountable, status),
    }));
    this.selectedRackMountable = undefined;
  }

  private ensureEnclosureBackSideMountableStatus(enclosure: BladeEnclosure, enclosureMountable: EnclosureMountable) {
    if (enclosure.status !== enclosureMountable.status) {
      this.store.dispatch(AssetActions.updateAsset({
        currentAsset: enclosureMountable,
        updatedAsset: createAssetValue(enclosureMountable, enclosure.status),
      }));
    }
  }

  droppedProvisionedSystemFromRackMountable(event: {provisionedSystem: ProvisionedSystem, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.removeProvisionedSystem({
      provisionedSystem: event.provisionedSystem,
      asset: this.selectedRackMountable,
      status: event.status,
    }));
    this.selectedRackMountable = undefined;
  }

  connectExistingSystemToRackServer(event: {systemId: string, typeName: string, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.connectExistingSystemToServerHardware({
      provisionableSystemId: event.systemId,
      provisionableTypeName: event.typeName,
      serverHardware: this.selectedRackMountable as RackServerHardware,
      status: event.status,
    }));
    this.selectedRackMountable = undefined;
  }

  createProvisionableSystemInRackServer(event: {name: string, typeName: string, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.createAndConnectProvisionableSystem({
      name: event.name,
      serverHardware: this.selectedRackMountable as RackServerHardware,
      status: event.status,
      typeName: event.typeName,
    }));
    this.selectedRackMountable = undefined;
  }

  removeRackmountable(status: AssetStatus) {
    this.store.dispatch(AssetActions.unmountRackMountable({rackMountable: this.selectedRackMountable, status}));
    this.selectedRackMountable = undefined;
  }

  changedEnclosureMountableStatus(status: AssetStatus) {
    const updatedAsset: AssetValue = {
      id: this.selectedEnclosureMountable.id,
      model: this.selectedEnclosureMountable.model,
      name: this.selectedEnclosureMountable.name,
      serialNumber: this.selectedEnclosureMountable.serialNumber,
      status,
    };
    this.store.dispatch(AssetActions.updateAsset({currentAsset: this.selectedEnclosureMountable, updatedAsset}));
    this.selectedEnclosureMountable = undefined;
  }

  droppedProvisionedSystemFromEnclosureMountable(event: {provisionedSystem: ProvisionedSystem, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.removeProvisionedSystem({
      provisionedSystem: event.provisionedSystem,
      asset: this.selectedEnclosureMountable,
      status: event.status,
    }));
    this.selectedEnclosureMountable = undefined;
  }

  connectExistingSystemToBladeServer(event: {systemId: string, typeName: string, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.connectExistingSystemToServerHardware({
      provisionableSystemId: event.systemId,
      provisionableTypeName: event.typeName,
      serverHardware: this.selectedEnclosureMountable as BladeServerHardware,
      status: event.status,
    }));
    this.selectedEnclosureMountable = undefined;
  }

  createProvisionableSystemInBladeServer(event: {name: string, typeName: string, status: AssetStatus}) {
    this.store.dispatch(ProvisionableActions.createAndConnectProvisionableSystem({
      name: event.name,
      serverHardware: this.selectedEnclosureMountable as BladeServerHardware,
      status: event.status,
      typeName: event.typeName,
    }));
    this.selectedEnclosureMountable = undefined;
  }

  removeEnclosureMountable(status: AssetStatus) {
    this.store.dispatch(AssetActions.unmountEnclosureMountable({enclosureMountable: this.selectedEnclosureMountable, status}));
    this.selectedEnclosureMountable = undefined;
  }

  mountRackMountable(event: {heightUnits: string, rack: Rack, rackMountable: RackMountable}) {
    this.store.dispatch(AssetActions.mountRackMountableToRack({...event}));
    this.selectedHeightUnit = 0;
  }

  setEnclosureAndSlot(enclosure?: BladeEnclosure, slot: number = 0) {
    this.selectedEnclosureContainer = enclosure ? this.enclosureContainers$.find(ec => ec.enclosure.id === enclosure.id) : undefined;
    this.selectedEnclosureSlot = slot;
  }

  mountEnclosureMountable(event: {enclosureMountable: EnclosureMountable, slot: string}) {
    this.store.dispatch(AssetActions.mountEnclosureMountableToEnclosure({
      enclosureMountable: event.enclosureMountable,
      slot: event.slot,
      enclosure: this.selectedEnclosureContainer.enclosure
    }));
    this.setEnclosureAndSlot();
  }
}
