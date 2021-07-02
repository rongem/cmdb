import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { llc } from '../../shared/store/functions';

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
    return this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      map(itemTypes => itemTypes.filter(itemType => Mappings.rackMountables.includes(llc(itemType.name))))
    );
  }

  get enclosureMountableTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      map(itemTypes => itemTypes.filter(itemType => Mappings.enclosureMountables.includes(llc(itemType.name))))
    );
  }

  getModelsForTargetType(targetType: string) {
    return this.store.select(fromSelectBasics.selectModelsForItemType(targetType));
  }

  getAssetsWithoutModel(itemTypeName: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemTypeByName(itemTypeName)).pipe(
      switchMap(itemType => this.store.select(fromSelectAsset.selectAssetsWithoutModelForItemType(itemType.id)))
    );
  }

}
