import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ErrorSelectors, MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get itemsWithoutModel() {
    return this.store.select(fromSelectAsset.selectItemsWithoutModel);
  }

  get assetTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      map(itemTypes => itemTypes.filter(itemType =>
        itemType.name.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase() ||
        Mappings.rackMountables.includes(itemType.name.toLocaleLowerCase()) ||
        Mappings.enclosureMountables.includes(itemType.name.toLocaleLowerCase()))),
    );
  }

}
