import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as fromSelectProv from '../../shared/store/provisionable/provisionable.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { ProvisionedSystem } from '../../shared/objects/asset/provisioned-system.model';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';

@Component({
  selector: 'app-rack-mountable',
  templateUrl: './rack-mountable.component.html',
  styleUrls: ['./rack-mountable.component.scss']
})
export class RackMountableComponent implements OnInit {
  @Input() mountable: RackMountable;
  @Output() changedStatus = new EventEmitter<AssetStatus>();
  @Output() dropProvisionedSystem = new EventEmitter<{provisionedSystem: ProvisionedSystem, status: AssetStatus}>();
  isServer = false;
  // private isBladeEnclosure = false;
  isAddingProvisionedSystem = false;
  targetType = Mappings.provisionedSystems[0];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
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
    return Mappings.provisionedSystems;
  }

  get availableProvisionedSystems() {
    return this.store.select(fromSelectProv.selectAvailableSystemsByType, this.targetType);
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

}
