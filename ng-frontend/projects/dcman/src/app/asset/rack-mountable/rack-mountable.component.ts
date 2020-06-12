import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';

@Component({
  selector: 'app-rack-mountable',
  templateUrl: './rack-mountable.component.html',
  styleUrls: ['./rack-mountable.component.scss']
})
export class RackMountableComponent implements OnInit {
  @Input() mountable: RackMountable;
  @Output() changedStatus = new EventEmitter<AssetStatus>();
  isServer = false;
  // private isBladeEnclosure = false;

  constructor() { }

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

  getStatusName(status: AssetStatus) {
    return Asset.getStatusCodeForAssetStatus(status).name;
  }

  setStatus(status: AssetStatus) {
    this.changedStatus.emit(status);
  }

}
