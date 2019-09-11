import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { take, map } from 'rxjs/operators';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

import { FullConnection } from 'src/app/shared/objects/full-connection.model';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: params.id as Guid}));
      }
      this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        take(1),
        map(value => value.result.Success)
        ).subscribe((value) => {
          if (value === false) {
            this.router.navigate(['display', 'search']);
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  get connectionTypesToLower() {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionTypeGroupsToLower));
  }

  get connectionTypesToUpper() {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionTypeGroupsToUpper));
  }

  getConnectionRuleIdsToLower(guid: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionRuleIdsToLowerByType, guid));
  }

  getConnectionRuleIdsToUpper(guid: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionRuleIdsToUpperByType, guid));
  }

  get connectionsCount() {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionsCount));
  }

  getTargetItemTypeByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
  }

  getTargetColorByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }
}
