import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as fromSelectMetaData from '../../shared/store/meta-data.selectors';
import * as fromSelectBasics from '../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../shared/store/asset/asset.selectors';
import * as MetaDataActions from '../../shared/store/meta-data.actions';

import { AppState } from '../../shared/store/app.reducer';
import { getRouterState } from '../../shared/store/router/router.reducer';
import { AppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

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

}
