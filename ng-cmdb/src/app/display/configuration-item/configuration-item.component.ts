import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Guid } from 'guid-typescript';
import { Subscription, Observable } from 'rxjs';

import { ConfigurationItemService } from './configuration-item.service';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { Connection } from 'src/app/shared/objects/connection.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Store } from '@ngrx/store';
import { AppState, CONFIGITEM } from 'src/app/shared/store/app-state.interface';
import { ConfigItemState } from './store/configuration-item.reducer';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected guid: Guid;
  configItemState: Observable<ConfigItemState>;
  private routeSubscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private meta: MetaDataService,
              private store: Store<AppState>,
              private sanitizer: DomSanitizer,
              public itemService: ConfigurationItemService) { }

  ngOnInit() {
    if (this.route.snapshot.routeConfig.path.startsWith(':id')) {
      this.getItem();
    }
    this.configItemState = this.store.select(CONFIGITEM);
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemService.getItem(params.id as Guid);
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  getItem() {
    if (Guid.isGuid(this.route.snapshot.params.id)) {
      this.guid = this.route.snapshot.params.id as Guid;
      this.itemService.getItem(this.guid);
    } else {
      this.router.navigate(['display', 'configuration-item', 'search']);
    }
  }

  getTypeBackground(typeId: Guid) {
    if (typeId) {
      const t = this.meta.getItemType(typeId);
      if (t) {
        return this.sanitizer.bypassSecurityTrustStyle('background: ' + t.TypeBackColor + ';');
      }
    }
  }

  getItemUpperType(ruleId: Guid) {
    const rule = this.meta.getConnectionRule(ruleId);
    if (rule) {
      return rule.ItemUpperType;
    }
  }

  getItemLowerType(ruleId: Guid) {
    const rule = this.meta.getConnectionRule(ruleId);
    if (rule) {
      return rule.ItemLowerType;
    }
  }

  getattributeTypeName(guid: Guid) {
    const at = this.meta.getAttributeType(guid);
    if (at) {
      return at.TypeName;
    }
    return '';
  }

  getConnectionsCount() {
    return this.itemService.getConnectionsCount();
  }

  getConnectionType(guid: Guid) {
    return this.meta.getConnectionType(guid);
  }

  getConnectionRulesToLowerByConnectionType(guid: Guid) {
    const rules: Guid[] = [];
    for (const connection of this.itemService.connectionsToLower) {
      if (connection.ConnType === guid && !rules.includes(connection.RuleId)) {
        rules.push(connection.RuleId);
      }
    }
    return rules;
  }

  getConnectionsToLowerByRule(ruleId: Guid) {
    const connections: Connection[] = [];
    for (const connection of this.itemService.connectionsToLower) {
      if (connection.RuleId === ruleId) {
        connections.push(connection);
      }
    }
    return connections;
  }

  getConnectionRulesToUpperByConnectionType(guid: Guid) {
    const rules: Guid[] = [];
    for (const connection of this.itemService.connectionsToUpper) {
      if (connection.ConnType === guid && !rules.includes(connection.RuleId)) {
        rules.push(connection.RuleId);
      }
    }
    return rules;
  }

  getConnectionsToUpperByRule(ruleId: Guid) {
    const connections: Connection[] = [];
    for (const connection of this.itemService.connectionsToUpper) {
      if (connection.RuleId === ruleId) {
        connections.push(connection);
      }
    }
    return connections;
  }
}
