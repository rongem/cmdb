import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get rackName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack;
  }

  get rackMountableTypes() {
    return this.store.pipe(
      select(MetaDataSelectors.selectItemTypes),
      map(itemTypes => itemTypes.filter(itemType => Mappings.rackMountables.includes(itemType.name.toLocaleLowerCase())))
    );
  }

  get enclosureMountableTypes() {
    return this.store.pipe(
      select(MetaDataSelectors.selectItemTypes),
      map(itemTypes => itemTypes.filter(itemType => Mappings.enclosureMountables.includes(itemType.name.toLocaleLowerCase())))
    );
  }

  getModelsForTargetType(targetType: string) {
    return this.store.select(fromSelectBasics.selectModelsForItemType, targetType);
  }

  getAssetsWithoutModel(itemTypeName: string) {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemTypeByName, itemTypeName),
      switchMap(itemType => this.store.select(fromSelectAsset.selectAssetsWithoutModelForItemType, itemType.id))
    );
  }

}
