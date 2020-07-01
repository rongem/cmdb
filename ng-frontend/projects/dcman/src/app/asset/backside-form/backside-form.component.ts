import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-backside-form',
  templateUrl: './backside-form.component.html',
  styleUrls: ['./backside-form.component.scss']
})
export class BacksideFormComponent implements OnInit {
  @Input() mountable: RackMountable;
  @Input() enclosure: BladeEnclosure;
  @Output() changedStatus = new EventEmitter<AssetStatus>();
  @Output() removeAsset = new EventEmitter<AssetStatus>();

  constructor() { }

  ngOnInit(): void {
  }

  get enclosureName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure;
  }

  getStatusName(status: AssetStatus) {
    return Asset.getStatusCodeForAssetStatus(status).name;
  }

  setStatus(status: AssetStatus) {
    if (status === AssetStatus.Stored || status === AssetStatus.Scrapped) {
      this.removeAsset.emit(status);
    } else {
      this.changedStatus.emit(status);
    }
  }

}
