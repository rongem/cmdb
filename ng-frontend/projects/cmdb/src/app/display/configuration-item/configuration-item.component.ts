import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { FullConnection, MetaDataSelectors } from 'backend-access';
import { DisplaySelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit {

  get itemReady() {
    return this.store.pipe(
      select(DisplaySelectors.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.select(DisplaySelectors.selectDisplayConfigurationItem);
  }

  get connectionTypesToLower() {
    return this.store.select(DisplaySelectors.selectUsedConnectionTypeGroupsToLower);
  }

  get connectionTypesToUpper() {
    return this.store.select(DisplaySelectors.selectUsedConnectionTypeGroupsToUpper);
  }

  get connectionsCount() {
    return this.store.select(DisplaySelectors.selectConnectionsCount);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  constructor(private store: Store) { }

  ngOnInit() {
  }

  getConnectionsByRule(ruleId: string, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connTypeId));
  }

  getConnectionRuleIdsToLower(guid: string) {
    return this.store.select(DisplaySelectors.selectUsedConnectionRuleIdsToLowerByType(guid));
  }

  getConnectionRuleIdsToUpper(guid: string) {
    return this.store.select(DisplaySelectors.selectUsedConnectionRuleIdsToUpperByType(guid));
  }

  getTargetItemTypeByRule(ruleId: string, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
    return '';
  }

  getTargetColorByRule(ruleId: string, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
    return '';
  }
}
