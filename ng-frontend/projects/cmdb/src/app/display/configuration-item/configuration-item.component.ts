import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeType, FullConnection, MetaDataSelectors } from 'backend-access';
import { map } from 'rxjs';
import { ItemSelectors } from '../../shared/store/store.api';


@Component({
    selector: 'app-configuration-item',
    templateUrl: './configuration-item.component.html',
    styleUrls: ['./configuration-item.component.scss'],
    standalone: false
})
export class ConfigurationItemComponent implements OnInit {

  constructor(private store: Store) { }

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

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get attributeTypes() {
    return this.store.select(ItemSelectors.attributeTypesForCurrentDisplayItemType);
  }

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

  getAttributeValue(attributeType: AttributeType) {
    return this.configurationItem.pipe(
      map(item => {
        const attribute = item.attributes.find(a => a.typeId === attributeType.id);
        return attribute ? attribute.value : '';
      })
    );
  }


}
