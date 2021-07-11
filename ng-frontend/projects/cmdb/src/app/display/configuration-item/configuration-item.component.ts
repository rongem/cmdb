import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FullConnection, MetaDataSelectors } from 'backend-access';
import { ItemSelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit {

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get connectionTypesToLower() {
    return this.store.select(ItemSelectors.usedConnectionTypeGroupsToLower);
  }

  get connectionTypesToUpper() {
    return this.store.select(ItemSelectors.usedConnectionTypeGroupsToUpper);
  }

  get connectionsCount() {
    return this.store.select(ItemSelectors.connectionsCount);
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
    return this.store.select(ItemSelectors.usedConnectionRuleIdsToLowerByType(guid));
  }

  getConnectionRuleIdsToUpper(guid: string) {
    return this.store.select(ItemSelectors.usedConnectionRuleIdsToUpperByType(guid));
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
