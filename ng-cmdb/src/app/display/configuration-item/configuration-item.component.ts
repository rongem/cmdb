import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Guid } from 'guid-typescript';

import { Connection } from 'src/app/shared/objects/full-configuration-item.model';
import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromConfigurationItem from './store/configuration-item.reducer';
import * as ConfigurationItemActions from './store/configuration-item.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected guid: Guid;
  configItemState: Observable<fromConfigurationItem.State>;
  metaDataState: Observable<fromMetaData.State>;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.configItemState = this.store.select(fromApp.CONFIGITEM);
    this.metaDataState = this.store.select(fromApp.METADATA);
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.store.dispatch(new ConfigurationItemActions.ReadItem(params.id as Guid));
      }
      this.actions$.pipe(
        ofType(ConfigurationItemActions.CLEAR_ITEM),
        take(1),
        map((value: ConfigurationItemActions.ClearItem) => {
          return value.payload.Success;
        })).subscribe((value) => {
          if (value === false) {
            this.router.navigate(['display', 'configuration-item', 'search']);
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  getTypeBackground(color: string) {
    return this.sanitizer.bypassSecurityTrustStyle('background: ' + color + ';');
  }

    getConnectionsByRule(ruleId: Guid, connections: Connection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getTargetItemTypeByRule(ruleId: Guid, connections: Connection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
  }

  getTargetColorByRule(ruleId: Guid, connections: Connection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
  }
}
