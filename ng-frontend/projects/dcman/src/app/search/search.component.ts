import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { map, withLatestFrom, take, tap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

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

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchText: string;
  searchType: string;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
  }

  get attributeNames() {
    return ExtendedAppConfigService.objectModel.AttributeTypeNames;
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      map(itemTypes => itemTypes.filter(t => (Mappings.rackMountables.includes(t.name.toLocaleLowerCase()) ||
        Mappings.enclosureMountables.includes(t.name.toLocaleLowerCase()) ||
        t.name.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase()) &&
        (!this.searchType || t.name.toLocaleLowerCase().includes(this.searchType.toLocaleLowerCase()))))
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
        this.itemTypes.pipe(map(types => types.map(t => t.id))),
      ),
      map(([racks, rackMountables, enclosureMountables, itemTypeIds]) => {
        const searchText = this.searchText.toLocaleLowerCase();
        const assets = [...racks, ...rackMountables, ...enclosureMountables].filter(asset =>
          itemTypeIds.includes(asset.item.typeId) && (asset.name.toLocaleLowerCase().includes(searchText) ||
          asset.serialNumber.toLocaleLowerCase().includes(searchText)) ||
          ((asset instanceof BladeServerHardware || asset instanceof RackServerHardware) && asset.provisionedSystem &&
            itemTypeIds.includes(asset.item.typeId) &&
            asset.provisionedSystem.name.toLocaleLowerCase().includes(searchText)));
        return assets;
      })
    );
  }

  getContainer(asset: Asset) {
    if (asset instanceof RackMountable && asset.assetConnection) {
      return this.store.select(fromSelectAssets.selectRack, asset.assetConnection.containerItemId);
    } else if (asset instanceof EnclosureMountable && asset.connectionToEnclosure) {
      return this.store.select(fromSelectAssets.selectEnclosure, asset.connectionToEnclosure.containerItemId);
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
        this.store.select(fromSelectAssets.selectEnclosure, asset.connectionToEnclosure.containerItemId).pipe(
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
