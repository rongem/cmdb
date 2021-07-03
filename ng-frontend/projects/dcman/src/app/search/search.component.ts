import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { map, withLatestFrom, take } from 'rxjs/operators';

import * as fromApp from '../shared/store/app.reducer';
import * as fromSelectAssets from '../shared/store/asset/asset.selectors';

import { Mappings } from '../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../shared/app-config.service';
import { BladeServerHardware } from '../shared/objects/asset/blade-server-hardware.model';
import { RackServerHardware } from '../shared/objects/asset/rack-server-hardware.model';
import { Rack } from '../shared/objects/asset/rack.model';
import { Asset } from '../shared/objects/prototypes/asset.model';
import { RackMountable } from '../shared/objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../shared/objects/asset/enclosure-mountable.model';
import { llc, llcc } from '../shared/store/functions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchText: string;
  private excludedTypes: string[] = [];

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
  }

  get attributeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  private get itemTypes() {
    return this.store.select(fromSelectAssets.selectAssetTypes);
  }

  get includedItemTypes() {
    return this.itemTypes.pipe(
      map(itemTypes => itemTypes.filter(t => !this.excludedTypes.includes(t.id)))
    );
  }

  get excludedItemTypes() {
    return this.itemTypes.pipe(
      map(itemTypes => itemTypes.filter(t => this.excludedTypes.includes(t.id)))
    );
  }

  get results() {
    if (!this.searchText || this.searchText === '') {
      return of([]);
    }
    return this.store.pipe(
      select(fromSelectAssets.selectRacks),
      withLatestFrom(
        this.store.select(fromSelectAssets.selectRackMountables),
        this.store.select(fromSelectAssets.selectEnclosureMountables),
        this.includedItemTypes.pipe(map(types => types.map(t => t.id))),
      ),
      map(([racks, rackMountables, enclosureMountables, itemTypeIds]) => {
        const searchText = llc(this.searchText);
        const assets = [...racks, ...rackMountables, ...enclosureMountables].filter(asset =>
          itemTypeIds.includes(asset.item.typeId) && (llc(asset.name).includes(searchText) ||
          llc(asset.serialNumber).includes(searchText)) ||
          ((asset instanceof BladeServerHardware || asset instanceof RackServerHardware) && asset.provisionedSystem &&
            itemTypeIds.includes(asset.item.typeId) &&
            llc(asset.provisionedSystem.name).includes(searchText)));
        return assets;
      })
    );
  }

  excludeType(typeId: string) {
    this.excludedTypes.push(typeId);
  }

  includeType(typeId: string) {
    this.excludedTypes = this.excludedTypes.filter(t => t !== typeId);
  }

  clearExcludedTypes() {
    this.excludedTypes = [];
  }

  showOnlyRackMountables() {
    this.itemTypes.pipe(
      take(1),
    ).subscribe(itemTypes =>
      this.excludedTypes = itemTypes.filter(t =>
        llcc(t.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack) ||
        Mappings.enclosureMountables.includes(llc(t.name))).map(t => t.id)
    );
  }

  showOnlyEnclosureMountables() {
    this.itemTypes.pipe(
      take(1),
    ).subscribe(itemTypes =>
      this.excludedTypes = itemTypes.filter(t =>
        llcc(t.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack) ||
        Mappings.rackMountables.includes(llc(t.name))).map(t => t.id)
    );
  }

  invertSelection() {
    this.itemTypes.pipe(
      take(1),
    ).subscribe(itemTypes => this.excludedTypes = itemTypes.map(t => t.id).filter(t => !this.excludedTypes.includes(t)));
  }

  getContainer(asset: Asset) {
    if (asset instanceof RackMountable && asset.assetConnection) {
      return this.store.select(fromSelectAssets.selectRack(asset.assetConnection.containerItemId));
    } else if (asset instanceof EnclosureMountable && asset.connectionToEnclosure) {
      return this.store.select(fromSelectAssets.selectEnclosure(asset.connectionToEnclosure.containerItemId));
    }
    return of(new Asset());
  }

  gotoResult(asset: Asset) {
    if (asset instanceof Rack) {
      this.router.navigate(['/asset', 'rack', asset.id]);
    } else if (asset instanceof RackMountable) {
      if (asset.assetConnection) {
        this.router.navigate(['/asset', 'rack', asset.assetConnection.containerItemId], {fragment: asset.id});
      } else {
        this.router.navigate(['/asset', asset.item.typeId]);
      }
    } else if (asset instanceof EnclosureMountable) {
      if (asset.connectionToEnclosure) {
        this.store.select(fromSelectAssets.selectEnclosure(asset.connectionToEnclosure.containerItemId)).pipe(
          take(1),
        ).subscribe(enclosure => {
          if (enclosure.assetConnection) {
            if (Mappings.enclosureBackSideMountables.includes(asset.type)) { // use enclosure instead of backside asset
              this.router.navigate(['/asset', 'rack', enclosure.assetConnection.containerItemId], {fragment: enclosure.id});
            } else {
              this.router.navigate(['/asset', 'rack', enclosure.assetConnection.containerItemId], {fragment: asset.id});
            }
          } else {
            this.router.navigate(['/asset', asset.item.typeId]);
          }
        });
      } else {
        this.router.navigate(['/asset', asset.item.typeId]);
      }
    }
  }

}
