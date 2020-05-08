import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { MetaDataSelectors } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../../shared/store/asset/asset.selectors';

import { AppState } from '../../../shared/store/app.reducer';
import { getRouterState } from '../../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';
import { Guid } from 'backend-access';
import { Asset } from '../../../shared/objects/prototypes/asset.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input() item: Asset;
  formOpen = false;
  private subscription: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

}
