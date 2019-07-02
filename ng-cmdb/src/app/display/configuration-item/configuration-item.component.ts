import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import { Connection } from 'src/app/shared/objects/full-configuration-item.model';
import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromConfigurationItem from './store/configuration-item.reducer';
import * as ConfigurationItemActions from './store/configuration-item.actions';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected guid: Guid;
  configItemState: Observable<fromConfigurationItem.ConfigItemState>;
  metaDataState: Observable<fromMetaData.MetaState>;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // if (this.route.snapshot.routeConfig.path.startsWith(':id')) {
    //   this.store.dispatch(new ConfigurationItemActions.ReadItem(this.route.snapshot.params.id as Guid));
    // }
    this.configItemState = this.store.select(fromApp.CONFIGITEM);
    this.metaDataState = this.store.select(fromApp.METADATA);
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.store.dispatch(new ConfigurationItemActions.ReadItem(params.id as Guid));
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  // getItem() {
  //   if (Guid.isGuid(this.route.snapshot.params.id)) {
  //     this.guid = this.route.snapshot.params.id as Guid;
  //     this.itemService.getItem(this.guid);
  //   } else {
  //     this.router.navigate(['display', 'configuration-item', 'search']);
  //   }
  // }

  getTypeBackground(color: string) {
    return this.sanitizer.bypassSecurityTrustStyle('background: ' + color + ';');
  }

  // getItemUpperType(ruleId: Guid) {
  //   return this.metaDataState.pipe(map(metaData => {
  //     const rule = metaData.connectionRules.find(r => r.RuleId === ruleId);
  //     if (rule) {
  //       return rule.ItemUpperType;
  //     }
  //   }));
  // }

  // getItemLowerType(ruleId: Guid) {
  //   return this.metaDataState.pipe(map(metaData => {
  //     const rule = metaData.connectionRules.find(r => r.RuleId === ruleId);
  //     if (rule) {
  //       return rule.ItemLowerType;
  //     }
  //   }));
  // }

  // getAttributeTypeName(guid: Guid) {
  //   const at = this.meta.getAttributeType(guid);
  //   if (at) {
  //     return at.TypeName;
  //   }
  //   return '';
  // }

  // getConnectionType(guid: Guid) {
  //   return this.meta.getConnectionType(guid);
  // }

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
