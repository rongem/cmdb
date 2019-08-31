import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { take, map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import { FullConnection } from 'src/app/shared/objects/full-connection.model';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected guid: Guid;
  displayState: Observable<fromDisplay.State>;
  metaDataState: Observable<fromMetaData.State>;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.displayState = this.store.select(fromApp.DISPLAY);
    this.metaDataState = this.store.select(fromApp.METADATA);
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

  getTypeBackground(color: string) {
    return this.sanitizer.bypassSecurityTrustStyle('background: ' + color + ';');
  }

    getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
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
}
