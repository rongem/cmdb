import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';

import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';

import { AppState } from '../../shared/store/app.reducer';
import { getRouterState } from '../../shared/store/router/router.reducer';
import { MetaDataSelectors } from 'backend-access';
import { Model } from '../../shared/objects/model.model';
import { createModel } from '../../shared/store/basics/basics.actions';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { llc, llcc } from '../../shared/store/functions';

@Component({
    selector: 'app-models',
    templateUrl: './models.component.html',
    styleUrls: ['./models.component.scss'],
    standalone: false
})
export class ModelsComponent implements OnInit {
  itemTypeId: string;

  constructor(private store: Store<AppState>) { }

  get models() {
    return this.store.pipe(
      select(fromSelectBasics.selectModels),
      withLatestFrom(this.route),
      map(([models, router]) => {
        const lowerNames = models.map(m => llc(m.name));
        if (router.fragment && llc(router.fragment) === 'without-manufacturer') {
          models = models.filter(i => !i.manufacturer);
        } else if (router.fragment && llc(router.fragment) === 'without-targettype') {
          models = models.filter(i => !i.targetType);
        } else if (router.fragment && llc(router.fragment) === 'incomplete-models') {
          models = models.filter(i => !i.manufacturer || !i.targetType);
        } else if (router.fragment && lowerNames.includes(llc(router.fragment))) {
          models = models.filter(i => llcc(i.targetType, router.fragment));
        }
        if (router.queryParams.name ) {
          models = models.filter(i => llc(i.name).includes(llc(router.queryParams.name)));
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
      map(itemTypes => itemTypes.filter(t => Mappings.rackMountables.includes(llc(t.name)) ||
        Mappings.enclosureMountables.includes(llc(t.name)) ||
        llcc(t.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack))),
    );
  }

  ngOnInit(): void {
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
