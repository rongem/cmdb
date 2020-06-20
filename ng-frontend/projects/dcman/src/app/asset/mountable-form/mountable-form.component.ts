import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromSelectProv from '../../shared/store/provisionable/provisionable.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { ProvisionedSystem } from '../../shared/objects/asset/provisioned-system.model';

@Component({
  selector: 'app-mountable-form',
  templateUrl: './mountable-form.component.html',
  styleUrls: ['./mountable-form.component.scss']
})
export class MountableFormComponent implements OnInit {
  @Input() mountable: RackMountable;
  @Output() changedStatus = new EventEmitter<AssetStatus>();
  @Output() dropProvisionedSystem = new EventEmitter<{provisionedSystem: ProvisionedSystem, status: AssetStatus}>();
  @Output() connectExistingSystem = new EventEmitter<{provisionedSystemId: string, status: AssetStatus}>();
  @Output() createProvisionableSystem = new EventEmitter<{name: string, type: string, status: AssetStatus}>();
  isServer = false;
  // private isBladeEnclosure = false;
  isAddingProvisionedSystem = false;
  targetTypeId: string;
  targetSystemId: string;
  selectOrCreate = 'create';
  newName: string;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.provisionedTypes.pipe(take(1)).subscribe(types => this.targetTypeId = types[0].id);
    this.isServer = this.mountable instanceof RackServerHardware || this.mountable instanceof BladeServerHardware;
    // this.isBladeEnclosure = this.mountable instanceof BladeEnclosure;
  }

  get provisionedSystem() {
    if (this.isServer) {
      if (this.mountable instanceof RackServerHardware) {
        return this.mountable.provisionedSystem;
      }
      if (this.mountable instanceof BladeServerHardware) {
        return this.mountable.provisionedSystem;
      }
    }
    return undefined;
  }

  get provisionedTypes() {
    return this.store.select(fromSelectProv.selectProvisionableTypes);
  }

  get availableProvisionedSystems() {
    return this.store.select(fromSelectProv.selectAvailableSystemsByTypeId, this.targetTypeId);
  }

  getStatusName(status: AssetStatus) {
    return Asset.getStatusCodeForAssetStatus(status).name;
  }

  setStatus(status: AssetStatus) {
    if (this.isServer && this.provisionedSystem &&
      status !== AssetStatus.Fault && status !== AssetStatus.InProduction && status !== AssetStatus.RepairPending) {
      this.dropProvisionedSystem.emit({provisionedSystem: this.provisionedSystem, status});
    } else {
      this.changedStatus.emit(status);
    }
  }

  createProvisionable(status: AssetStatus) {
    this.connectExistingSystem.emit({provisionedSystemId: this.targetSystemId, status});
  }

  connectProvisionable(status: AssetStatus) {
    this.createProvisionableSystem.emit({name: this.newName, type: this.targetTypeId, status});
  }

}
