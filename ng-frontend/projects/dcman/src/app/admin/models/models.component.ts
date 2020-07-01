import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { getRouterState } from '../../shared/store/router/router.reducer';
import { MetaDataSelectors } from 'backend-access';
import { Model } from '../../shared/objects/model.model';
import { createModel } from '../../shared/store/basics/basics.actions';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  itemTypeId: string;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get models() {
    return this.store.pipe(
      select(fromSelectBasics.selectModels),
      withLatestFrom(this.route),
      map(([models, router]) => {
        const lowerNames = models.map(m => m.name.toLocaleLowerCase());
        if (router.fragment && router.fragment.toLocaleLowerCase() === 'without-manufacturer') {
          models = models.filter(i => !i.manufacturer);
        } else if (router.fragment && router.fragment.toLocaleLowerCase() === 'without-targettype') {
          models = models.filter(i => !i.targetType);
        } else if (router.fragment && router.fragment.toLocaleLowerCase() === 'incomplete-models') {
          models = models.filter(i => !i.manufacturer || !i.targetType);
        } else if (router.fragment && lowerNames.includes(router.fragment.toLocaleLowerCase())) {
          models = models.filter(i => i.targetType.toLocaleLowerCase() === router.fragment.toLocaleLowerCase());
        }
        if (router.queryParams.name ) {
          models = models.filter(i => i.name.toLocaleLowerCase().includes(router.queryParams.name.toLocaleLowerCase()));
        }
        return models;
      }),
    );
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      map(itemTypes => itemTypes.filter(t => Mappings.rackMountables.includes(t.name.toLocaleLowerCase()) ||
        Mappings.enclosureMountables.includes(t.name.toLocaleLowerCase()) ||
        t.name.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase()))
    );
  }

  getModelsByItemType(itemTypeName: string) {
    return itemTypeName && itemTypeName !== '' ?
      this.models.pipe(map(models => models.filter(m => m.targetType === itemTypeName?.toLocaleLowerCase()))) :
      this.models.pipe(map(models => models.filter(m => !m.targetType)));
  }

  onSubmit(model: Model) {
    this.itemTypeId = '';
    this.store.dispatch(createModel({model}));
  }

}
